import { TPaginatedListResponse } from '@/app/ds';
import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import { omitUndefined } from '@/app/utils';
import { MyPokemonListQuery, TMyPokemonDetail, TMyPokemonEntry } from '../types';


export class MyPokemonService extends BaseServiceAbstract {
  constructor(baseUrl: string, token?: string) {
    super(baseUrl, 'my-pokemon', token);
  }

  public async list(params: MyPokemonListQuery = {}): Promise<TPaginatedListResponse<TMyPokemonEntry> | Array<TMyPokemonEntry>> {
    const sanitizedParams = omitUndefined(params);
    return await this.get<TPaginatedListResponse<TMyPokemonEntry> | Array<TMyPokemonEntry>>(this.pathUrl, { params: { ...sanitizedParams } });
  }

  public async detail(id: string): Promise<TMyPokemonDetail> {
    return await this.get<TMyPokemonDetail>(`${this.pathUrl}/${id}`);
  }

  public async updateNickname(id: string, nickname: string): Promise<TMyPokemonEntry> {
    return await this.path<{ nickname: string }, TMyPokemonEntry>(`${this.pathUrl}/${id}`, {
      body: { nickname },
    });
  }
}
