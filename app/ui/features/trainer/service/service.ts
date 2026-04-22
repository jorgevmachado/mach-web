import { BaseServiceAbstract } from '@/app/shared/services/service/service';
import { InitializeTrainerParams, TrainerResponse } from '@/app/ui/features/trainer/types';

export class TrainerService extends BaseServiceAbstract {
  constructor(baseUrl: string, token: string) {
    super(baseUrl, 'trainers', token);
  }

  public async initialize(params: InitializeTrainerParams): Promise<TrainerResponse> {
    return await this.post<InitializeTrainerParams, TrainerResponse>(
      `${this.pathUrl}/initialize`,
      { body: params },
    );
  }
}
