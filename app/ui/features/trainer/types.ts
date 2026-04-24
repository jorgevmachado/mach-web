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
  pokedex_status: 'EMPTY' | 'INITIALIZING' | 'READY' | 'FAILED';
  pokemon_name?: string | null;
  created_at: string;
};

export type TrainerMeResponse = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  pokedex_status: 'EMPTY' | 'INITIALIZING' | 'READY' | 'FAILED';
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
