/**
 * The only module that touches auth storage.
 *
 * Tokens, role flags and the refresh-token cookie were previously read and
 * written with inline `localStorage.getItem(...)` calls spread over a dozen
 * components, each with its own spelling. Everything funnels through here now.
 */

const KEYS = {
  access: "access_token",
  refresh: "refresh_token",
  username: "username",
  isSuperuser: "is_superuser",
  isStaff: "is_staff",
  role: "role",
};

const REFRESH_COOKIE = "refresh_token";

/** Emitted when the session is cleared (expired refresh token, logout). */
export const SESSION_EXPIRED_EVENT = "redcross:session-expired";

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    if (value === undefined || value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    /* storage disabled (private mode) - ignore */
  }
};

/** Read a cookie by name. */
export const getCookie = (name) => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.trim().startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

export const session = {
  getAccessToken: () => read(KEYS.access),

  /** Refresh token, preferring localStorage and falling back to the cookie. */
  getRefreshToken: () => read(KEYS.refresh) || getCookie(REFRESH_COOKIE),

  setAccessToken: (token) => write(KEYS.access, token),

  /**
   * Store a rotated refresh token.
   *
   * The backend runs SIMPLE_JWT with ROTATE_REFRESH_TOKENS and
   * BLACKLIST_AFTER_ROTATION, so every refresh issues a new refresh token and
   * blacklists the one just used. Dropping the new one would leave us holding
   * a blacklisted token and log the user out on the next refresh.
   */
  setRefreshToken: (token) => {
    if (!token) return;
    write(KEYS.refresh, token);
    const secure = window.location.protocol === "https:";
    document.cookie = `${REFRESH_COOKIE}=${token}; path=/; ${
      secure ? "secure; SameSite=None" : "SameSite=Lax"
    }`;
  },

  /** Persist a successful login response. */
  save({ access, refresh, username, is_superuser, is_staff, role }) {
    write(KEYS.access, access);
    write(KEYS.refresh, refresh);
    write(KEYS.username, username);
    write(KEYS.isSuperuser, is_superuser);
    write(KEYS.isStaff, is_staff);
    write(KEYS.role, role);

    if (refresh) {
      const secure = window.location.protocol === "https:";
      document.cookie = `${REFRESH_COOKIE}=${refresh}; path=/; ${
        secure ? "secure; SameSite=None" : "SameSite=Lax"
      }`;
    }
  },

  /** The shape the AppContext user state expects. */
  getUser() {
    const access = read(KEYS.access);
    const username = read(KEYS.username);
    return {
      is_authenticated: Boolean(access && username),
      username: username || "",
      is_superuser: read(KEYS.isSuperuser) === "true",
      is_staff: read(KEYS.isStaff) === "true",
      role: read(KEYS.role) || "",
    };
  },

  isAuthenticated: () => Boolean(read(KEYS.access)),

  clear() {
    Object.values(KEYS).forEach((key) => write(key, null));
    document.cookie = `${REFRESH_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  },

  /** Clear storage and let the app react (close menus, show login). */
  expire() {
    session.clear();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  },
};

/**
 * True when a JWT's `exp` claim has passed (or it cannot be decoded).
 *
 * @param {string|null} token
 * @param {number} [skewSeconds] treat the token as expired this many seconds
 *   early, covering clock drift and slow requests. A large upload is rejected
 *   against the token's state when it *arrives*, not when it was sent.
 */
export const isTokenExpired = (token, skewSeconds = 0) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 - skewSeconds * 1000 < Date.now();
  } catch {
    return true;
  }
};

export default session;
