/**
 * Turns any axios / fetch failure into one readable sentence.
 *
 * Replaces the `error.response?.data?.message || "Something went wrong"`
 * chains that were copy-pasted into every component.
 */

const FALLBACK = "Something went wrong. Please try again.";

/** Pull the most specific message a DRF error payload offers. */
const fromPayload = (data) => {
  if (!data) return null;
  if (typeof data === "string") return data;

  const direct =
    data.message || data.detail || data.error || data.non_field_errors;
  if (direct) return Array.isArray(direct) ? direct[0] : String(direct);

  // DRF field errors: { email: ["Already registered."] }
  const firstField = Object.entries(data).find(
    ([, value]) =>
      typeof value === "string" ||
      (Array.isArray(value) && typeof value[0] === "string")
  );
  if (firstField) {
    const [field, value] = firstField;
    const text = Array.isArray(value) ? value[0] : value;
    return `${field.replace(/_/g, " ")}: ${text}`;
  }
  return null;
};

export const getErrorMessage = (error, fallback = FALLBACK) => {
  if (!error) return fallback;

  if (error.response) {
    const { status, data } = error.response;
    const message = fromPayload(data);
    if (message) return message;

    if (status === 401) return "Your session has expired. Please log in again.";
    if (status === 403) return "You do not have permission to do that.";
    if (status === 404) return "We could not find what you were looking for.";
    if (status >= 500) return "The server is having trouble. Please try again shortly.";
    return fallback;
  }

  if (error.code === "ECONNABORTED") {
    return "The request timed out. The server may be waking up - please retry.";
  }
  if (error.request) {
    return "Cannot reach the server. Check your internet connection.";
  }
  return error.message || fallback;
};

/** Field-level errors, for highlighting inputs. */
export const getFieldErrors = (error) => {
  const data = error?.response?.data;
  if (!data || typeof data !== "object") return {};
  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => !["message", "detail", "error"].includes(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : String(value)])
  );
};

export const isUnauthorized = (error) => error?.response?.status === 401;
export const isNotFound = (error) => error?.response?.status === 404;

export default getErrorMessage;
