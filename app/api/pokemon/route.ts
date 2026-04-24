import { NextRequest, NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { pokemonService } from '@/app/ui/features/pokemon';
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
    const response = await pokemonService(session.token).list({
      page: parseNumberParam(searchParams.get('page')),
      limit: parseNumberParam(searchParams.get('limit')),
      name: sanitizedParams(searchParams.get('name')),
      order: sanitizedParams(searchParams.get('order')),
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const responseError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      { message: responseError?.message ?? 'Failed to fetch Pokemon list.' },
      { status: responseError?.statusCode ?? 500 },
    );
  }
}
