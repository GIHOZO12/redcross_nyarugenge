/** Authentication, the current user, and Django CSRF priming. */

import { get, post, setCsrfToken } from "../client";
import { endpoints } from "../endpoints";
import { session } from "../session";

export const authService = {
  /** Log in, persist the session, and return the user payload. */
  async login({ email, password }) {
    const data = await post(
      endpoints.auth.login,
      { email, password },
      { skipAuth: true }
    );
    session.save(data);
    return data;
  },

  register: ({ username, email, password }) =>
    post(endpoints.auth.register, { username, email, password }, { skipAuth: true }),

  /** Tell the backend to blacklist the refresh token, then clear storage. */
  async logout() {
    const refresh = session.getRefreshToken();
    try {
      if (refresh) await post(endpoints.auth.logout, { refresh });
    } finally {
      session.clear();
    }
  },

  /** @param {{email: string, new_password: string, confirm_password: string}} payload */
  resetPassword: (payload) =>
    post(endpoints.auth.resetPassword, payload, { skipAuth: true }),

  /** The logged-in user's profile, or null when not signed in. */
  async getCurrentUser() {
    if (!session.isAuthenticated()) return null;
    return get(endpoints.auth.currentUser);
  },

  /** @param {File} image */
  changeProfilePicture(image) {
    const form = new FormData();
    form.append("profile_image", image);
    return post(endpoints.auth.changeProfilePicture, form);
  },

  /**
   * Fetch Django's CSRF token and hand it to the client, which replays it in
   * the `X-CSRFToken` header. Needed because the `csrftoken` cookie is
   * `SameSite=Lax` and so unreadable from this (different) origin.
   *
   * Only `/get-csrf-token/` exists on the deployed backend; the underscore
   * spelling 404s, so it is tried second.
   */
  async fetchCsrfToken() {
    for (const url of [endpoints.auth.csrfToken, endpoints.auth.csrfTokenAlt]) {
      try {
        const data = await get(url);
        if (data?.csrfToken) {
          setCsrfToken(data.csrfToken);
          return data.csrfToken;
        }
      } catch {
        /* try the alternate spelling */
      }
    }
    return null;
  },

  /** Token used by the public "share an idea" form. */
  async fetchUserToken() {
    try {
      const data = await get(endpoints.auth.userToken);
      const token = data?.csrfToken ?? data?.token ?? null;
      setCsrfToken(token);
      return token;
    } catch {
      // Fall back to the standard endpoint if this route is absent.
      return authService.fetchCsrfToken();
    }
  },

  session,
};

export default authService;
