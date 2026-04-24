import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokemonService } from '@/app/ui/features/pokemon';

type PokemonDetailRouteContext = {
  params: Promise<{ name: string }>;
};

export async function GET(
  _request: Request,
  { params }: PokemonDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await params;
    const response = await pokemonService(session.token).detail(decodeURIComponent(name));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const responseError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      { message: responseError?.message ?? 'Failed to fetch Pokemon details.' },
      { status: responseError?.statusCode ?? 500 },
    );
  }
}
