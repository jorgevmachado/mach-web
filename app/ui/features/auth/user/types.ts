import React from 'react';
import type { TrainerMeResponse } from '@/app/ui/features/trainer/types';

export type StatusEnum = 'ACTIVE' | 'COMPLETE' | 'INACTIVE' | 'INCOMPLETE';

export type TUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  status: StatusEnum;
  trainer?: TrainerMeResponse | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type UserProviderProps = {
  children: React.ReactNode;
  initialUser?: TUser;
  tokenExpiresAt?: number;
  isAuthenticated: boolean;

};

export type UserContextValue = {
  user?: TUser;
  isLoading: boolean;
  clearUser: () => void;
  refreshUser: () => Promise<TUser | undefined>;
  isAuthenticated: boolean;
};
