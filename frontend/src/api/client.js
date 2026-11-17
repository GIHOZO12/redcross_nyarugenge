/**
 * The single axios instance used by the whole app.
 *
 * It owns the cross-cutting concerns that used to be repeated at every call
 * site:
 *   - the backend host, read from `VITE_BACKEND_URL`
 *   - the `Authorization: Bearer <token>` header
 *   - the Django `X-CSRFToken` header on unsafe methods
 *   - cookies (`withCredentials`) for Django session/CSRF
 *   - one transparent access-token refresh + retry on 401
 *   - multipart boundaries for FormData bodies
 *
 * Components never import axios directly; they call a service in
 * `api/services/` which calls this client.
 */

import axios from "axios";
import { API_BASE_URL } from "../config/env";
import { endpoints } from "./endpoints";
import { session, getCookie, isTokenExpired } from "./session";

const SAFE_METHODS = ["get", "head", "options"];

/**
 * Refresh this many seconds before the access token actually expires.
 *
 * Access tokens live 10 minutes (SIMPLE_JWT.ACCESS_TOKEN_LIFETIME) and a slow
 * upload can be in flight for a while, so a token that is merely "about to
 * expire" is treated as expired.
 */
const REFRESH_SKEW_SECONDS = 60;

/**
 * CSRF token held in memory.
 *
 * The backend sets `csrftoken` with `SameSite=Lax`, and the frontend is a
 * different site (vercel.app vs onrender.com), so the browser neither sends
 * that cookie on cross-site requests nor lets JS read it. The token therefore
 * has to come from the body of `/get-csrf-token/` and be replayed by hand.
 */
let csrfToken = null;

/** Remember the token returned by `authService.fetchCsrfToken()`. */
export const setCsrfToken = (token) => {
  if (token) csrfToken = token;
};

export const getCsrfToken = () => getCookie("csrftoken") || csrfToken;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Django session + CSRF cookies
  timeout: 60000, // free-tier hosts can cold-start slowly
  headers: { Accept: "application/json" },
});

/* ------------------------------------------------------------------ *
 * Access-token refresh, shared by both interceptors
 * ------------------------------------------------------------------ */

// Shared promise so ten parallel requests trigger exactly one refresh call.
let refreshPromise = null;

const refreshAccessToken = async () => {
  const refresh = session.getRefreshToken();
  if (!refresh) return null;

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}${endpoints.auth.refreshToken}`,
      { refresh },
      { headers: { "Content-Type": "application/json" } }
    );
    if (!data?.access) return null;
    session.setAccessToken(data.access);
    // Rotation is on, so the response carries a fresh refresh token and the
    // one we just sent is now blacklisted. Keep the new one or the next
    // refresh fails and the user is signed out mid-session.
    session.setRefreshToken(data.refresh);
    return data.access;
  } catch {
    return null;
  }
};

/** Run at most one refresh at a time, whoever asks for it. */
const refreshOnce = async () => {
  refreshPromise = refreshPromise || refreshAccessToken();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

/* ------------------------------------------------------------------ *
 * Request: attach auth + CSRF, let axios set multipart boundaries
 * ------------------------------------------------------------------ */

api.interceptors.request.use(async (config) => {
  if (!config.skipAuth) {
    let token = session.getAccessToken();

    // Refresh *before* sending rather than reacting to the rejection.
    //
    // DRF checks permissions before it reads the request body, so an expired
    // token makes the server answer immediately and close the connection while
    // the browser is still uploading. The browser reports that as
    // ERR_HTTP2_PROTOCOL_ERROR with no response attached, so there is no 401
    // or 403 left to retry on - and nothing is written to the server's access
    // log either. Verified against the deployed backend: a 500KB body to an
    // IsAuthenticated endpoint is reset mid-flight, while the same body to an
    // endpoint that reads it returns a clean response.
    // Also covers a missing access token while a refresh token is still held,
    // which otherwise sends the request with no credentials at all.
    const needsRefresh = !token || isTokenExpired(token, REFRESH_SKEW_SECONDS);
    if (needsRefresh && session.getRefreshToken()) {
      token = (await refreshOnce()) || token;
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  const method = (config.method || "get").toLowerCase();
  if (!SAFE_METHODS.includes(method)) {
    // Cookie first (same-site setups), then the token kept in memory.
    const token = getCsrfToken();
    if (token) config.headers["X-CSRFToken"] = token;
  }

  // Never hand-set multipart/form-data: axios must add the boundary itself.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

/* ------------------------------------------------------------------ *
 * Response: refresh the access token once, then replay the request
 * ------------------------------------------------------------------ */

/**
 * Is this failure "your token is no good" rather than "you may not do that"?
 *
 * DRF answers an expired or missing token with **403, not 401**, because
 * SessionAuthentication sits first in DEFAULT_AUTHENTICATION_CLASSES and its
 * `authenticate_header()` returns None, which makes DRF fall back to 403.
 * Access tokens live 10 minutes (SIMPLE_JWT.ACCESS_TOKEN_LIFETIME), so without
 * this every authenticated request starts failing ten minutes after login
 * instead of quietly refreshing.
 *
 * Matched on the two bodies DRF produces for authentication failure; a genuine
 * permission denial carries neither, so it is never retried.
 */
const isAuthFailure = (response) => {
  if (!response) return false;
  if (response.status === 401) return true;
  if (response.status !== 403) return false;

  const data = response.data;
  if (!data || typeof data !== "object") return false;
  return (
    data.code === "token_not_valid" ||
    data.detail === "Authentication credentials were not provided."
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};

    const canRetry =
      isAuthFailure(error.response) &&
      Boolean(session.getRefreshToken()) &&
      !config._retried &&
      !config.skipAuth &&
      !config.skipAuthRefresh;

    if (!canRetry) return Promise.reject(error);

    config._retried = true;

    const newToken = await refreshOnce();

    if (!newToken) {
      session.expire(); // storage cleared + `redcross:session-expired` fired
      return Promise.reject(error);
    }

    config.headers = { ...config.headers, Authorization: `Bearer ${newToken}` };
    return api(config);
  }
);

/* ------------------------------------------------------------------ *
 * Thin helpers so services read as one line each
 * ------------------------------------------------------------------ */

/** GET and return `response.data`. */
export const get = (url, config) => api.get(url, config).then((r) => r.data);

/** POST and return `response.data`. */
export const post = (url, data, config) =>
  api.post(url, data, config).then((r) => r.data);

export const put = (url, data, config) =>
  api.put(url, data, config).then((r) => r.data);

export const patch = (url, data, config) =>
  api.patch(url, data, config).then((r) => r.data);

/** DELETE and return `response.data`. */
export const remove = (url, config) =>
  api.delete(url, config).then((r) => r.data);

/** GET a file (PDF, export) as a Blob. */
export const getBlob = (url, config) =>
  api.get(url, { ...config, responseType: "blob" }).then((r) => r.data);

/**
 * Trigger a browser download for a backend file endpoint.
 * @returns {Promise<void>}
 */
export const downloadFile = async (url, filename, config) => {
  const blob = await getBlob(url, config);
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
};

/** Build a FormData body from a plain object, skipping empty values. */
export const toFormData = (values) => {
  const form = new FormData();
  Object.entries(values || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    form.append(key, value);
  });
  return form;
};

export { api };
export default api;
