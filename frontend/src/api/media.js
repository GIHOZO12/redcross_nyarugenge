/**
 * Resolves image / file paths returned by the API into usable URLs.
 *
 * The backend is inconsistent: some fields already contain a full CDN URL
 * (`https://pub-...r2.dev/leaders_image/x.jpg`) while others return a relative
 * media path (`media/profiles/x.jpg`). Components used to template the host in
 * by hand, which broke whenever the host changed.
 */

import { BACKEND_URL } from "../config/env";

/**
 * @param {string|null|undefined} path - value from the API
 * @param {string|null} [fallback] - used when `path` is empty
 * @returns {string|null} an absolute URL, or the fallback
 */
export const mediaUrl = (path, fallback = null) => {
  if (!path) return fallback;

  const value = String(path).trim();
  if (!value) return fallback;

  // Already absolute (CDN, S3, R2) or a data/blob preview.
  if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) {
    return value;
  }

  return `${BACKEND_URL}/${value.replace(/^\/+/, "")}`;
};

export default mediaUrl;
