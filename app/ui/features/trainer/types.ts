import type { TMyPokemonEntry } from '@/app/ui/features/my-pokemon/types';
import type { TPokedexEntry } from '@/app/ui/features/pokedex/types';

export type PokedexStatusEnum = 'EMPTY' | 'INITIALIZING' | 'READY' | 'FAILED';

export type InitializeTrainerParams = {
  pokeballs: number;
  capture_rate: number;
  pokemon_name?: string;
};

export type TrainerResponse = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  pokedex_status: PokedexStatusEnum;
  pokemon_name?: string | null;
  message?: string | null;
  created_at: string;
};

export type TrainerMeResponse = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  pokedex_status: PokedexStatusEnum;
  pokedex_entries: TPokedexEntry[];
  my_pokemons: TMyPokemonEntry[];
  pokemon_name?: string | null;
  message?: string | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type TTrainer = TrainerMeResponse;
