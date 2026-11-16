/**
 * The write-side counterpart to `useFetch`: submitting a form without
 * hand-rolling `loading` / `error` state in every component.
 *
 *   const { mutate: save, loading, error } = useMutation(announcementsService.create, {
 *     onSuccess: () => navigate("/admin/announcement"),
 *   });
 *   ...
 *   <button disabled={loading} onClick={() => save(formData)}>Save</button>
 */

import { useCallback, useRef, useState } from "react";
import { getErrorMessage, getFieldErrors } from "../api/errors";

/**
 * @param {Function} request - service function, receives whatever you pass to `mutate`
 * @param {{onSuccess?: Function, onError?: Function}} [options]
 */
export const useMutation = (request, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [data, setData] = useState(null);

  const requestRef = useRef(request);
  const optionsRef = useRef(options);
  requestRef.current = request;
  optionsRef.current = options;

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const result = await requestRef.current(...args);
      setData(result);
      optionsRef.current.onSuccess?.(result);
      return { ok: true, data: result };
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      setFieldErrors(getFieldErrors(err));
      optionsRef.current.onError?.(err, message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setFieldErrors({});
    setData(null);
  }, []);

  return { mutate, loading, error, fieldErrors, data, reset };
};

export default useMutation;
