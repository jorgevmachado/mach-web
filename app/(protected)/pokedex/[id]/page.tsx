import { PokedexDetailPage } from '@/app/ui/features/pokedex';

type PokedexDetailRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function PokedexDetailRoutePage({ params }: PokedexDetailRoutePageProps) {
  const { id } = await params;

  return <PokedexDetailPage id={decodeURIComponent(id)} />;
}
