import {FiltersProps, TListQuery, TPaginatedListResponse} from "@/app/ds";

export type TPokemon = {
    id: string;
}

export type PokemonFilters = {
  order?: string;
  name?: string;
  status?: string;
}

export type PokemonListQuery = TListQuery & PokemonFilters;

export type UsePokemonListResult = {
    items: TPaginatedListResponse<TPokemon>['items'];
    meta: TPaginatedListResponse<TPokemon>['meta'];
    reload: () => void;
    filters: PokemonFilters;
    goToPage: (page: number) => void;
    isLoading: boolean;
    clearFilters: () => void;
    inputFilters: FiltersProps['filters'];
    applyFilters: (nextFilters: PokemonFilters) => void;
    errorMessage?: string;
    applyInputFilters: (nextFilters: PokemonFilters) => void;
    clearInputFilters: () => void;
    updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
}