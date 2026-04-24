import type { FiltersProps, TListQuery, TPaginatedListResponse } from '@/app/ds';

import type { PokemonStatus, TPokemonDetail, TPokemonMove, TPokemonTypeRelation } from '@/app/ui/features/pokemon/types';

export type MyPokemonFilters = {
  nickname?: string;
  pokemon_name?: string;
};

export type TMyPokemonPokemon = {
  id: string;
  name: string;
  order: number;
  status: PokemonStatus;
  external_image: string;
  image?: string | null;
  types: TPokemonTypeRelation[];
};

export type TMyPokemonEntry = {
  id: string;
  hp: number;
  iv_hp: number;
  ev_hp: number;
  wins: number;
  level: number;
  losses: number;
  max_hp: number;
  battles: number;
  nickname: string;
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
  formula: string;
  pokemon: TMyPokemonPokemon;
  trainer_id: string;
  pokemon_id: string;
  captured_at: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TMyPokemonDetail = Omit<TMyPokemonEntry, 'pokemon'> & {
  pokemon: TPokemonDetail;
  moves: TPokemonMove[];
};

export type MyPokemonListQuery = TListQuery & MyPokemonFilters;

export type UseMyPokemonListResult = {
  items: TPaginatedListResponse<TMyPokemonEntry>['items'];
  meta: TPaginatedListResponse<TMyPokemonEntry>['meta'];
  reload: () => void;
  filters: MyPokemonFilters;
  goToPage: (page: number) => void;
  isLoading: boolean;
  clearFilters: () => void;
  inputFilters: FiltersProps['filters'];
  applyFilters: (nextFilters: MyPokemonFilters) => void;
  errorMessage?: string;
  applyInputFilters: (nextFilters: MyPokemonFilters) => void;
  clearInputFilters: () => void;
  updateInputFilters: (inputFilters: FiltersProps['filters']) => void;
};

export type UseMyPokemonDetailResult = {
  entry?: TMyPokemonDetail;
  isLoading: boolean;
  errorMessage?: string;
  reload: () => void;
  updateNickname: (nickname: string) => Promise<void>;
  isUpdating: boolean;
  updateErrorMessage?: string;
};
