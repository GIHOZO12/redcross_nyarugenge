/**
 * Data loading for a page or component in one line.
 *
 * Before:
 *   const [items, setItems] = useState([]);
 *   useEffect(() => {
 *     axios.get("https://host/all_fellowships/")
 *       .then((r) => setItems(r.data))
 *       .catch((e) => console.error(e));
 *   }, []);
 *
 * After:
 *   const { data: items, loading, error, refetch } = useFetch(fellowshipService.all, [], []);
 *
 * It also cancels state updates after unmount, which the old pattern did not
 * (React logged "setState on an unmounted component" warnings on fast
 * navigation), and keeps a `refetch` for use after a create/delete.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../api/errors";

/**
 * @param {Function} request - a service function returning a promise
 * @param {Array} deps - re-run when these change (like useEffect deps)
 * @param {*} initialData - value held while loading, e.g. `[]` or `null`
 * @param {{enabled?: boolean, onSuccess?: Function, onError?: Function}} [options]
 */
export const useFetch = (request, deps = [], initialData = null, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const mounted = useRef(true);
  // Keep callbacks in refs so passing inline arrow functions does not re-run the effect.
  const requestRef = useRef(request);
  const handlersRef = useRef({ onSuccess, onError });

  requestRef.current = request;
  handlersRef.current = { onSuccess, onError };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestRef.current();
      if (!mounted.current) return result;
      setData(result);
      handlersRef.current.onSuccess?.(result);
      return result;
    } catch (err) {
      if (mounted.current) {
        setError(getErrorMessage(err));
        handlersRef.current.onError?.(err);
      }
      return undefined;
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    load();
  }, [enabled, load]);

  return { data, loading, error, refetch: load, setData };
};

export default useFetch;
