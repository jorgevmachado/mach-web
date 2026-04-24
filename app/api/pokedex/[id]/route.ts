import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokedexService } from '@/app/ui/features/pokedex/service';

type PokedexDetailRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: PokedexDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const response = await pokedexService(session.token).detail(decodeURIComponent(id));
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const responseError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      { message: responseError?.message ?? 'Failed to fetch Pokedex detail.' },
      { status: responseError?.statusCode ?? 500 },
    );
  }
}
