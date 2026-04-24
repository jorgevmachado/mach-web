import { PokemonDetailPage } from '@/app/ui/features/pokemon';

type PokemonDetailRoutePageProps = {
  params: Promise<{ name: string }>;
};

export default async function PokemonDetailRoutePage({ params }: PokemonDetailRoutePageProps) {
  const { name } = await params;

  return <PokemonDetailPage name={decodeURIComponent(name)} />;
}
