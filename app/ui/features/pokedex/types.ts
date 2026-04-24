import type { FiltersProps, TListQuery, TPaginatedListResponse } from '@/app/ds';

import type { PokemonStatus, TPokemonDetail, TPokemonTypeRelation } from '@/app/ui/features/pokemon/types';
import type { TrainerMeResponse } from '@/app/ui/features/trainer/types';

export type PokedexFilters = {
  pokemon_name?: string;
};

export type TPokedexPokemon = {
  id: string;
  name: string;
  order: number;
  status: PokemonStatus;
  external_image: string;
  image?: string | null;
  types: TPokemonTypeRelation[];
};

export type TPokedexEntry = {
  id: string;
  hp: number;
  iv_hp: number;
  ev_hp: number;
  wins: number;
  level: number;
  losses: number;
  max_hp: number;
  battles: number;
  speed: number;
  iv_speed: number;
  ev_speed: number;
  attack: number;
  iv_attack: number;
  ev_attack: number;
  defense: number;
  iv_defense: number;
  ev_defense: number;
  experience: number;
  special_attack: number;
  iv_special_attack: number;
  ev_special_attack: number;
  special_defense: number;
  iv_special_defense: number;
  ev_special_defense: number;
  discovered: boolean;
  formula: string;
  pokemon: TPokedexPokemon;
  trainer_id: string;
  pokemon_id: string;
  discovered_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TPokedexDetail = Omit<TPokedexEntry, 'pokemon'> & {
  pokemon: TPokemonDetail;
};

export type PokedexListQuery = TListQuery & PokedexFilters;

export type UsePokedexListResult = {
  items: TPaginatedListResponse<TPokedexEntry>['items'];
  meta: TPaginatedListResponse<TPokedexEntry>['meta'];
  reload: () => Promise<void>;
  filters: PokedexFilters;
  goToPage: (page: number) => void;
  isLoading: boolean;
  clearFilters: () => void;
  inputFilters: FiltersProps['filters'];
  applyFilters: (nextFilters: PokedexFilters) => void;
  errorMessage?: string;
  applyInputFilters: (nextFilters: PokedexFilters) => void;
  clearInputFilters: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
  trainer?: TrainerMeResponse;
  trainerErrorMessage?: string;
  isTrainerLoading: boolean;
  retryInitialization: () => Promise<void>;
  isRetrying: boolean;
};

export type UsePokedexDetailResult = {
  entry?: TPokedexDetail;
  isLoading: boolean;
  errorMessage?: string;
  reload: () => void;
};
