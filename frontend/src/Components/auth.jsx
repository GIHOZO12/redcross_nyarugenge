/**
 * Deprecated - kept so older imports keep working.
 *
 * Token refresh is no longer something a component has to think about: the
 * axios instance in `api/client.js` refreshes an expired access token and
 * replays the failed request automatically.
 *
 * Prefer importing from the API layer directly:
 *   import { session, isTokenExpired } from "../api";
 */

import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { session, isTokenExpired } from "../api/session";

/**
 * Exchange the stored refresh token for a new access token.
 * @returns {Promise<string|null>} the new access token, or null
 */
export const refreshToken = async () => {
  const refresh = session.getRefreshToken();
  if (!refresh) {
    console.error("No refresh token found. Please log in again.");
    return null;
  }

  try {
    const { data } = await api.post(
      endpoints.auth.refreshToken,
      { refresh },
      { skipAuth: true }
    );
    if (!data?.access) return null;
    session.setAccessToken(data.access);
    // Refresh-token rotation is enabled server side; keep the new one.
    session.setRefreshToken(data.refresh);
    return data.access;
  } catch (error) {
    console.error("Failed to refresh token", error);
    return null;
  }
};

export { isTokenExpired };
