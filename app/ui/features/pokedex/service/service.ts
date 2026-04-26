import { TPaginatedListResponse } from '@/app/ds';
import { BaseServiceAbstract } from '@/app/shared/services/service/service';

import { PokedexListQuery, TPokedexDetail, TPokedexEntry } from '../types';
import { omitUndefined } from '@/app/utils';

export class PokedexService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'pokedex', token);
  }

  public async list(params: PokedexListQuery = {}): Promise<TPaginatedListResponse<TPokedexEntry> | Array<TPokedexEntry>> {
    const sanitizedParams = omitUndefined(params);
    return await this.get<TPaginatedListResponse<TPokedexEntry> | Array<TPokedexEntry>>(this.pathUrl, {
      params: { ...sanitizedParams },
    });
  }

  public async detail(id: string): Promise<TPokedexDetail> {
    return await this.get<TPokedexDetail>(`${this.pathUrl}/${id}`);
  }
}
