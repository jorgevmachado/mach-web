'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useLoading } from '@/app/ds';

import type { TMyPokemonDetail, UseMyPokemonDetailResult } from '../types';

type MyPokemonDetailState = {
  entry?: TMyPokemonDetail;
  isLoading: boolean;
  errorMessage?: string;
  isUpdating: boolean;
  updateErrorMessage?: string;
};

const INITIAL_STATE: MyPokemonDetailState = {
  entry: undefined,
  isLoading: true,
  errorMessage: undefined,
  isUpdating: false,
  updateErrorMessage: undefined,
};

const useMyPokemonDetail = (id: string): UseMyPokemonDetailResult => {
  const [state, setState] = useState<MyPokemonDetailState>(INITIAL_STATE);
  const requestIdRef = useRef(0);
  const { startContentLoading, stopContentLoading } = useLoading();

  const fetchEntry = useCallback(async (): Promise<void> => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const response = await fetch(`/api/my-pokemon/${encodeURIComponent(id)}`, {
        method: 'GET',
        cache: 'no-store',
      });
      const json = (await response.json()) as TMyPokemonDetail | { message?: string };

      if (requestIdRef.current !== requestId) {
        return;
      }

      if (!response.ok || !('id' in json)) {
        setState((previousState) => ({
          ...previousState,
          entry: undefined,
          isLoading: false,
          errorMessage: 'message' in json && json.message ? json.message : 'Could not fetch captured Pokemon detail.',
        }));
        return;
      }

      setState((previousState) => ({
        ...previousState,
        entry: json,
        isLoading: false,
        errorMessage: undefined,
      }));
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setState((previousState) => ({
        ...previousState,
        entry: undefined,
        isLoading: false,
        errorMessage: error instanceof Error && error.message ? error.message : 'Could not fetch captured Pokemon detail.',
      }));
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

  const updateNickname = useCallback(async (nickname: string) => {
    setState((previousState) => ({
      ...previousState,
      isUpdating: true,
      updateErrorMessage: undefined,
    }));

    try {
      const response = await fetch(`/api/my-pokemon/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      const json = (await response.json()) as TMyPokemonDetail | { message?: string };

      if (!response.ok || !('id' in json)) {
        setState((previousState) => ({
          ...previousState,
          isUpdating: false,
          updateErrorMessage: 'message' in json && json.message ? json.message : 'Could not update nickname.',
        }));
        return;
      }

      setState((previousState) => ({
        ...previousState,
        entry: {
          ...previousState.entry!,
          nickname: json.nickname,
          updated_at: json.updated_at,
        },
        isUpdating: false,
        updateErrorMessage: undefined,
      }));
    } catch (error) {
      setState((previousState) => ({
        ...previousState,
        isUpdating: false,
        updateErrorMessage: error instanceof Error && error.message ? error.message : 'Could not update nickname.',
      }));
    }
  }, [id]);

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
    updateNickname,
    isUpdating: state.isUpdating,
    updateErrorMessage: state.updateErrorMessage,
  };
};

export default useMyPokemonDetail;
