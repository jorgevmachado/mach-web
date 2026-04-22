import React from 'react';

export type TUser = {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

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

