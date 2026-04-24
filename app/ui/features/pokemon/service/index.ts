import { PokemonService } from './service';
import { getBaseUrl } from '@/app/utils/url/url';

export const pokemonService = (token?: string): PokemonService => {
  return new PokemonService(getBaseUrl(), token);
};
