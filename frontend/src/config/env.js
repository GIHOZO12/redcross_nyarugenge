/**
 * Centralised, validated access to Vite environment variables.
 *
 * Every network call in the app resolves its host from here, so switching
 * between local Django and the deployed backend is a one-line change in `.env`:
 *
 *   VITE_BACKEND_URL=https://redcross-backend-urqo.onrender.com
 */

const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;

if (!rawBackendUrl) {
  // Fail loudly in development instead of silently firing requests at the
  // dev server origin and getting confusing 404s / index.html responses.
  console.error(
    "[config] VITE_BACKEND_URL is not defined. Create a `.env` file in /frontend with:\n" +
      "VITE_BACKEND_URL=https://redcross-backend-urqo.onrender.com\n" +
      "then restart `npm run dev` (Vite only reads .env at startup)."
  );
}

/** Backend origin with any trailing slash removed, e.g. `https://host.com`. */
export const BACKEND_URL = String(rawBackendUrl || "").replace(/\/+$/, "");

/** Base URL every API request is built on. */
export const API_BASE_URL = BACKEND_URL;

/** Django admin, linked from the navbar. */
export const DJANGO_ADMIN_URL = `${BACKEND_URL}/admin/`;

export const IS_DEV = import.meta.env.DEV;

export default { BACKEND_URL, API_BASE_URL, DJANGO_ADMIN_URL, IS_DEV };
