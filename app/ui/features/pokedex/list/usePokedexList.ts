'use client';

import { useCallback, useEffect, useState } from 'react';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list';
import type { TrainerMeResponse } from '@/app/ui/features/trainer/types';

import type { PokedexFilters, TPokedexEntry, UsePokedexListResult } from '../types';

const INITIAL_FILTERS: PokedexFilters = {
  pokemon_name: '',
};

const INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
  {
    label: 'NAME',
    type: 'text',
    name: 'pokemon_name',
    value: '',
    placeholder: 'Search by species name',
  },
];

const usePokedexList = (): UsePokedexListResult => {
  const listState = usePaginatedList<TPokedexEntry, PokedexFilters>({
    endpoint: '/api/pokedex',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters: INITIAL_INPUT_FILTERS,
    fetchErrorMessage: 'Could not fetch Pokedex entries.',
    normalizeFilters: (nextFilters) => ({
      pokemon_name: nextFilters?.pokemon_name?.trim(),
    }),
  });
  const [trainer, setTrainer] = useState<TrainerMeResponse | undefined>(undefined);
  const [trainerErrorMessage, setTrainerErrorMessage] = useState<string | undefined>(undefined);
  const [isTrainerLoading, setIsTrainerLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchTrainer = useCallback(async () => {
    setIsTrainerLoading(true);
    setTrainerErrorMessage(undefined);

    try {
      const response = await fetch('/api/trainers/me', { method: 'GET', cache: 'no-store' });
      const json = (await response.json()) as TrainerMeResponse | { message?: string };

      if (!response.ok || !('id' in json)) {
        setTrainer(undefined);
        setTrainerErrorMessage(
          'message' in json && json.message
            ? json.message
            : 'Could not fetch trainer.',
        );
        return;
      }

      setTrainer(json);
    } catch (error) {
      setTrainer(undefined);
      setTrainerErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : 'Could not fetch trainer.',
      );
    } finally {
      setIsTrainerLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTrainer();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [fetchTrainer]);

  const reload = useCallback(async () => {
    listState.reload();
    await fetchTrainer();
  }, [fetchTrainer, listState]);

  const retryInitialization = useCallback(async () => {
    if (!trainer) {
      return;
    }

    setIsRetrying(true);
    try {
      await fetch('/api/trainers/initialize', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          pokeballs: trainer.pokeballs,
          capture_rate: trainer.capture_rate,
        }),
      });
    } finally {
      setIsRetrying(false);
      await reload();
    }
  }, [reload, trainer]);

  return {
    ...listState,
    reload,
    trainer,
    trainerErrorMessage,
    isTrainerLoading,
    retryInitialization,
    isRetrying,
  };
};

export default usePokedexList;
