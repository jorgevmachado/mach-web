import { PokemonService } from './service';
import { getBaseUrl } from '@/app/utils/url/url';

export const pokemonService = (): PokemonService => {
  return new PokemonService(getBaseUrl());
};
