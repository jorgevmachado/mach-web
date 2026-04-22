'use client';

import { useActionState, useEffect, useState } from 'react';

import { INITIAL_AUTH_ACTION_STATE } from '@/app/shared/lib/auth';
import { logoutAction } from '@/app/actions/auth';
import { initializeTrainerAction } from '@/app/actions/trainer';
import { useUser } from '@/app/ui/features/auth/user';
import type { StatusEnum } from '@/app/ui/features/auth/user/types';
import { useRouter } from 'next/navigation';

const STATUS_BADGE: Record<StatusEnum, string> = {
  INCOMPLETE: 'bg-amber-100 text-amber-800 border-amber-200',
  COMPLETE: 'bg-green-100 text-green-800 border-green-200',
  ACTIVE: 'bg-blue-100 text-blue-800 border-blue-200',
  INACTIVE: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function Home() {
  const { user, isLoading, refreshUser } = useUser();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [trainerState, trainerFormAction, isPending] = useActionState(
    initializeTrainerAction,
    INITIAL_AUTH_ACTION_STATE,
  );

  useEffect(() => {
    if (trainerState.status === 'success') {
      void refreshUser().then(() => {
        setShowModal(false);
        router.refresh();
      });
    }
  }, [trainerState.status, refreshUser, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-lg">
        {/* User card */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          {/* Avatar placeholder + name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Details */}
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500 font-medium">Email</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-500 font-medium">Status</dt>
              <dd>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_BADGE[user.status]}`}>
                  {user.status}
                </span>
              </dd>
            </div>
          </dl>

          {/* INITIALIZE button */}
          {user.status === 'INCOMPLETE' && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
                Complete your profile by initializing your trainer.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
              >
                INITIALIZE
              </button>
            </div>
          )}

          {/* Logout */}
          <form action={logoutAction} className="mt-4">
            <button
              type="submit"
              className="w-full text-gray-500 hover:text-gray-700 text-sm underline"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Initialize Trainer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Initialize Trainer</h2>
            <p className="text-sm text-gray-500 mb-5">Set up your starter kit to begin your journey.</p>

            <form action={trainerFormAction} className="space-y-4">
              <div>
                <label htmlFor="pokeballs" className="block text-sm font-medium text-gray-700 mb-1">
                  Pokéballs
                </label>
                <input
                  id="pokeballs"
                  name="pokeballs"
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
              </div>

              <div>
                <label htmlFor="capture_rate" className="block text-sm font-medium text-gray-700 mb-1">
                  Capture Rate
                </label>
                <input
                  id="capture_rate"
                  name="capture_rate"
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="50"
                />
              </div>

              {trainerState.status === 'error' && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {trainerState.message}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  {isPending ? 'Saving…' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}