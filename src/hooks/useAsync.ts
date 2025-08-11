import { useState, useEffect, useCallback } from 'react';

interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = true, initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: initialData,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState(prevState => ({ ...prevState, loading: false, error: err }));
      onError?.(err);
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, onSuccess, onError, ...dependencies]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}
