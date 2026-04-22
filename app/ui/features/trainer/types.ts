export type InitializeTrainerParams = {
  pokeballs: number;
  capture_rate: number;
};

export type TrainerResponse = {
  id: string;
  user_id: string;
  pokeballs: number;
  capture_rate: number;
  created_at: string;
};
