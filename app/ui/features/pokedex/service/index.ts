import { getBaseUrl } from '@/app/utils';

import { PokedexService } from './service';

export const pokedexService = (token?: string): PokedexService => {
  return new PokedexService(getBaseUrl(), token);
};
