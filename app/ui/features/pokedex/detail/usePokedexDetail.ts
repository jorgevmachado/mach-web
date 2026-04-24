'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLoading } from '@/app/ds';

import type { TPokedexDetail, UsePokedexDetailResult } from '../types';

type PokedexDetailState = {
  entry?: TPokedexDetail;
  isLoading: boolean;
  errorMessage?: string;
};

const INITIAL_STATE: PokedexDetailState = {
  entry: undefined,
  isLoading: true,
  errorMessage: undefined,
};

const usePokedexDetail = (id: string): UsePokedexDetailResult => {
  const [state, setState] = useState<PokedexDetailState>(INITIAL_STATE);
  const requestIdRef = useRef(0);
  const { startContentLoading, stopContentLoading } = useLoading();

  const fetchEntry = useCallback(async (): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const response = await fetch(`/api/pokedex/${encodeURIComponent(id)}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const json = (await response.json()) as TPokedexDetail | { message?: string };

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (!response.ok || !('id' in json)) {
        setState({
          entry: undefined,
          isLoading: false,
          errorMessage: 'message' in json && json.message ? json.message : 'Could not fetch Pokedex details.',
        });
        return;
      }

      setState({
        entry: json,
        isLoading: false,
        errorMessage: undefined,
      });
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setState({
        entry: undefined,
        isLoading: false,
        errorMessage: error instanceof Error && error.message ? error.message : 'Could not fetch Pokedex details.',
      });
    } finally {
      stopContentLoading();
    }
  }, [id, stopContentLoading]);

  const reload = useCallback(() => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    void fetchEntry();
  }, [fetchEntry, startContentLoading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startContentLoading();
      void fetchEntry();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchEntry, startContentLoading]);

  return {
    entry: state.entry,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    reload,
  };
};

export default usePokedexDetail;
