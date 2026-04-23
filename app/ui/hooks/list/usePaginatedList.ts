'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { type FiltersProps, type TPaginatedListResponse, type TPaginatedMeta, useLoading } from '@/app/ds';

const INITIAL_PAGINATION: TPaginatedMeta = {
  total: 0,
  limit: 10,
  offset: 0,
  next_page: undefined,
  previous_page: undefined,
  total_pages: 0,
  current_page: 1,
};

type ListFilterValueMap = Record<string, string | undefined>;

type PaginatedListState<TItem> = {
  items: TPaginatedListResponse<TItem>['items'];
  meta: TPaginatedListResponse<TItem>['meta'];
  isLoading: boolean;
  errorMessage?: string;
};

type UsePaginatedListParams<TFilters> = {
  endpoint: string;
  initialFilters: TFilters;
  initialInputFilters: FiltersProps['filters'];
  fetchErrorMessage: string;
  normalizeFilters: (nextFilters: TFilters) => TFilters;
  buildQueryString?: (page: number, limit: number, filters: TFilters) => string;
};

type UsePaginatedListResult<TItem, TFilters> = {
  items: TPaginatedListResponse<TItem>['items'];
  meta: TPaginatedListResponse<TItem>['meta'];
  isLoading: boolean;
  errorMessage?: string;
  filters: TFilters;
  inputFilters: FiltersProps['filters'];
  goToPage: (page: number) => void;
  applyFilters: (nextFilters: TFilters) => void;
  applyInputFilters: (nextFilters: TFilters) => void;
  clearFilters: () => void;
  clearInputFilters: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
  reload: () => void;
};

const createInitialState = <TItem,>(): PaginatedListState<TItem> => ({
  items: [],
  meta: INITIAL_PAGINATION,
  isLoading: true,
  errorMessage: undefined,
});

const clampPage = (page: number, totalPages: number): number => {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
};

const defaultBuildQueryString = <TFilters,>(page: number, limit: number, filters: TFilters): string => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  Object.entries(filters as ListFilterValueMap).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    params.set(key, value);
  });

  return params.toString();
};

const usePaginatedList = <TItem, TFilters>({
  endpoint,
  initialFilters,
  initialInputFilters,
  fetchErrorMessage,
  normalizeFilters,
  buildQueryString = defaultBuildQueryString,
}: UsePaginatedListParams<TFilters>): UsePaginatedListResult<TItem, TFilters> => {
  const [state, setState] = useState<PaginatedListState<TItem>>(() => createInitialState<TItem>());
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [inputFilters, setInputFilters] = useState<FiltersProps['filters']>(initialInputFilters);
  const requestIdRef = useRef(0);
  const { startContentLoading, stopContentLoading } = useLoading();

  const fetchPage = useCallback(async (page: number, activeFilters: TFilters, per_page: number = 12): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();

    try {
      const queryString = buildQueryString(page, per_page, activeFilters);
      const response = await fetch(`${endpoint}?${queryString}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const json = (await response.json()) as TPaginatedListResponse<TItem> | { message?: string };

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (!response.ok || !('items' in json) || !('meta' in json)) {
        const message = 'message' in json && json.message ? json.message : fetchErrorMessage;

        setState((previousState) => ({
          ...previousState,
          isLoading: false,
          errorMessage: message,
        }));

        return;
      }

      const normalizedPage = clampPage(json.meta.current_page, json.meta.total_pages);

      setState({
        items: json.items,
        meta: {
          ...json.meta,
          current_page: normalizedPage,
        },
        isLoading: false,
        errorMessage: undefined,
      });
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      const errorMessage = error instanceof Error && error.message ? error.message : fetchErrorMessage;

      setState((previousState) => ({
        ...previousState,
        isLoading: false,
        errorMessage,
      }));
    } finally {
      stopContentLoading();
    }
  }, [buildQueryString, endpoint, fetchErrorMessage, startContentLoading, stopContentLoading]);

  useEffect(() => {
    void fetchPage(1, filters);
  }, [fetchPage, filters]);

  const goToPage = useCallback((page: number) => {
    const targetPage = clampPage(page, state.meta.total_pages);

    if (targetPage === state.meta.current_page || state.isLoading) {
      return;
    }

    void fetchPage(targetPage, filters);
  }, [fetchPage, filters, state.isLoading, state.meta.current_page, state.meta.total_pages]);

  const applyFilters = useCallback((nextFilters: TFilters) => {
    setFilters(normalizeFilters(nextFilters));
  }, [normalizeFilters]);

  const applyInputFilters = useCallback((nextFilters: TFilters) => {
    setInputFilters((previousState) => {
      const filterValues = nextFilters as ListFilterValueMap;

      return previousState.map((filter) => {
        const filterValue = filterValues[filter.name];

        return {
          ...filter,
          value: filterValue || '',
        };
      });
    });

    applyFilters(nextFilters);
  }, [applyFilters]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const clearInputFilters = useCallback(() => {
    setInputFilters((previousState) => {
      return previousState.map((filter) => ({
        ...filter,
        value: '',
      }));
    });

    clearFilters();
  }, [clearFilters]);

  const updateInputFilters = useCallback((nextInputFilters: FiltersProps['filters']) => {
    setInputFilters(nextInputFilters);
  }, []);

  const reload = useCallback(() => {
    void fetchPage(state.meta.current_page, filters);
  }, [fetchPage, filters, state.meta.current_page]);

  return {
    items: state.items,
    meta: state.meta,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    filters,
    inputFilters,
    goToPage,
    applyFilters,
    applyInputFilters,
    clearFilters,
    clearInputFilters,
    updateInputFilters,
    reload,
  };
};

export default usePaginatedList;
