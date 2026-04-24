import { NextResponse } from 'next/server';

import { getServerSession } from '@/app/shared/lib/auth/server';
import { myPokemonService } from '@/app/ui/features/my-pokemon/service';

type MyPokemonDetailRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: MyPokemonDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const response = await myPokemonService(session.token).detail(decodeURIComponent(id));
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const responseError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      { message: responseError?.message ?? 'Failed to fetch My Pokemon detail.' },
      { status: responseError?.statusCode ?? 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: MyPokemonDetailRouteContext,
): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { id } = await params;
    const response = await myPokemonService(session.token).updateNickname(
      decodeURIComponent(id),
      payload.nickname,
    );
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const responseError = error as { message?: string; statusCode?: number };
    return NextResponse.json(
      { message: responseError?.message ?? 'Failed to update nickname.' },
      { status: responseError?.statusCode ?? 500 },
    );
  }
}
