import { TrainerService } from './service';
import { getBaseUrl } from '@/app/utils/url/url';

export const trainerService = (token: string): TrainerService => {
  return new TrainerService(getBaseUrl(), token);
};
