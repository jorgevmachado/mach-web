import { TPaginatedListResponse } from '@/app/ds';
import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import { PokedexListQuery, TPokedexDetail, TPokedexEntry } from '../types';

export class PokedexService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokedex', token);
  }

  public async list(params: PokedexListQuery = {}): Promise<TPaginatedListResponse<TPokedexEntry>> {
    return await this.get<TPaginatedListResponse<TPokedexEntry>>(this.pathUrl, {
      params,
    });
  }

  public async detail(id: string): Promise<TPokedexDetail> {
    return await this.get<TPokedexDetail>(`${this.pathUrl}/${id}`);
  }
}
