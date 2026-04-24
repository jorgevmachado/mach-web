import { MyPokemonDetailPage } from '@/app/ui/features/my-pokemon';

type MyPokemonDetailRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MyPokemonDetailRoutePage({ params }: MyPokemonDetailRoutePageProps) {
  const { id } = await params;

  return <MyPokemonDetailPage id={decodeURIComponent(id)} />;
}
