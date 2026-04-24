'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { TPokemonDetail, UsePokemonDetailResult } from '../types';
import { useLoading } from '@/app/ds';

type PokemonDetailState = {
  pokemon?: TPokemonDetail;
  isLoading: boolean;
  errorMessage?: string;
};

const INITIAL_STATE: PokemonDetailState = {
  pokemon: undefined,
  isLoading: true,
  errorMessage: undefined,
};

const usePokemonDetail = (name: string): UsePokemonDetailResult => {
  const [state, setState] = useState<PokemonDetailState>(INITIAL_STATE);
  const requestIdRef = useRef(0);
  const { startContentLoading, stopContentLoading } = useLoading();

  const fetchPokemon = useCallback(async (): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const response = await fetch(`/api/pokemon/${encodeURIComponent(name)}`, {
        method: 'GET',
        cache: 'no-store',
      });

      const json = (await response.json()) as TPokemonDetail | { message?: string };

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (!response.ok || !('id' in json)) {
        setState({
          pokemon: undefined,
          isLoading: false,
          errorMessage: 'message' in json && json.message
            ? json.message
            : 'Could not fetch Pokemon details.',
        });
        return;
      }

      setState({
        pokemon: json,
        isLoading: false,
        errorMessage: undefined,
      });
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setState({
        pokemon: undefined,
        isLoading: false,
        errorMessage: error instanceof Error && error.message
          ? error.message
          : 'Could not fetch Pokemon details.',
      });
    } finally {
      stopContentLoading();
    }
  }, [name, stopContentLoading]);

  const reload = useCallback(() => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      errorMessage: undefined,
    }));
    startContentLoading();
    void fetchPokemon();
  }, [fetchPokemon, startContentLoading]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startContentLoading();
      void fetchPokemon();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchPokemon, startContentLoading]);

  return {
    pokemon: state.pokemon,
    isLoading: state.isLoading,
    errorMessage: state.errorMessage,
    reload,
  };
};

export default usePokemonDetail;
