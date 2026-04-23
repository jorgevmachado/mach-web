'use client';

import type { FiltersProps } from '@/app/ds';

import type { PokemonFilters, TPokemon, UsePokemonListResult } from '../types';
import usePaginatedList from "@/app/ui/hooks/list";

const INITIAL_FILTERS: PokemonFilters = {
  name: '',
  order: '',
};

const INITIAL_INPUT_FILTERS: FiltersProps['filters'] = [
  {
    label: 'NAME',
    type: 'text',
    name: 'name',
    value: '',
    placeholder: 'Search by name',
  },
  {
    label: 'ORDER',
    type: 'text',
    name: 'order',
    value: '',
    placeholder: 'Search by order',
  },
];

const usePokemonList = (): UsePokemonListResult => {
  return usePaginatedList<TPokemon, PokemonFilters>({
    endpoint: '/api/pokemon',
    initialFilters: INITIAL_FILTERS,
    initialInputFilters: INITIAL_INPUT_FILTERS,
    fetchErrorMessage: 'Could not fetch Pokémon entries.',
    normalizeFilters: (nextFilters) => ({
      name: nextFilters?.name?.trim(),
      order: nextFilters?.order?.trim(),
    }),
  });
};

export default usePokemonList;
