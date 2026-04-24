'use client';

import type { FiltersProps } from '@/app/ds';
import usePaginatedList from '@/app/ui/hooks/list';

import type { MyPokemonFilters, TMyPokemonEntry, UseMyPokemonListResult } from '../types';

const INITIAL_FILTERS: MyPokemonFilters = {
  nickname: '',
  pokemon_name: '',
};

const INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
  {
    label: 'NICKNAME',
    type: 'text',
    name: 'nickname',
    value: '',
    placeholder: 'Search by nickname',
  },
  {
    label: 'SPECIES',
    type: 'text',
    name: 'pokemon_name',
    value: '',
    placeholder: 'Search by species name',
  },
];

const useMyPokemonList = (): UseMyPokemonListResult => {
  return usePaginatedList<TMyPokemonEntry, MyPokemonFilters>({
    endpoint: '/api/my-pokemon',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters: INITIAL_INPUT_FILTERS,
    fetchErrorMessage: 'Could not fetch captured Pokemon.',
    normalizeFilters: (nextFilters) => ({
      nickname: nextFilters?.nickname?.trim(),
      pokemon_name: nextFilters?.pokemon_name?.trim(),
    }),
  });
};

export default useMyPokemonList;
