import { FiltersProps, TListQuery, TPaginatedListResponse } from '@/app/ds';

export type PokemonStatus = 'ACTIVE' | 'COMPLETE' | 'INACTIVE' | 'INCOMPLETE';

export type TPokemon = {
  id: string;
  name: string;
  order: number;
  status: PokemonStatus;
  external_image: string;
  image?: string | null;
}

export type TPokemonMove = {
  id: string;
  pp: number;
  url: string;
  type: string;
  name: string;
  order: number;
  power: number;
  target: string;
  effect: string;
  priority: number;
  accuracy: number;
  short_effect: string;
  damage_class: string;
  effect_chance?: number | null;
}

export type TPokemonAbility = {
  id: string;
  url: string;
  order: number;
  name: string;
  slot: number;
  is_hidden: boolean;
}

export type TPokemonTypeRelation = {
  id: string;
  name: string;
  text_color: string;
  background_color: string;
}

export type TPokemonType = {
  id: string;
  url: string;
  order: number;
  name: string;
  text_color: string;
  background_color: string;
  weaknesses: TPokemonTypeRelation[];
  strengths: TPokemonTypeRelation[];
}

export type TPokemonGrowthRate = {
  id: string;
  url: string;
  name: string;
  formula: string;
  description: string;
}

export type TPokemonDetail = TPokemon & {
  hp?: number | null;
  speed?: number | null;
  height?: number | null;
  weight?: number | null;
  attack?: number | null;
  defense?: number | null;
  habitat?: string | null;
  is_baby?: boolean | null;
  shape_url?: string | null;
  shape_name?: string | null;
  is_mythical?: boolean | null;
  gender_rate?: number | null;
  is_legendary?: boolean | null;
  capture_rate?: number | null;
  hatch_counter?: number | null;
  base_happiness?: number | null;
  special_attack?: number | null;
  base_experience?: number | null;
  special_defense?: number | null;
  evolution_chain?: string | null;
  evolves_from_species?: string | null;
  has_gender_differences?: boolean | null;
  growth_rate?: TPokemonGrowthRate | null;
  moves: TPokemonMove[];
  abilities: TPokemonAbility[];
  types: TPokemonType[];
  evolutions: TPokemon[];
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

export type UsePokemonDetailResult = {
  pokemon?: TPokemonDetail;
  isLoading: boolean;
  errorMessage?: string;
  reload: () => void;
}
