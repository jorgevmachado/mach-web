import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import { TPaginatedListResponse } from '@/app/ds';
import { PokemonListQuery, TPokemon } from '@/app/ui';
import { omitUndefined } from '@/app/utils';

export class PokemonService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokemon', token);
  }

  public async list(params: PokemonListQuery = {}): Promise<TPaginatedListResponse<TPokemon>> {
    const sanitizedParams = omitUndefined(params);
    return await this.get<TPaginatedListResponse<TPokemon>>(
      this.pathUrl, { params: { ...sanitizedParams } }
    );
  }

  public async detail(name: string): Promise<TPokemon> {
    return await this.get<TPokemon>(`${this.pathUrl}/${name}`);
  }
}
