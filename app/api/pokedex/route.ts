import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokedexService } from '@/app/ui/features/pokedex/service';
import { sanitizedParams } from '@/app/utils/url/url';

const parseNumberParam = (value: string | null): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const response = await pokedexService(session.token).list({
      page: parseNumberParam(searchParams.get('page')),
      limit: parseNumberParam(searchParams.get('limit')),
      pokemon_name: sanitizedParams(searchParams.get('pokemon_name')),
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const responseError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      { message: responseError?.message ?? 'Failed to fetch Pokedex list.' },
      { status: responseError?.statusCode ?? 500 },
    );
  }
}
