'use client';

import { Badge, BarChart, Card, Image, Text } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import type { TPokemonTypeRelation } from '@/app/ui/features/pokemon/types';

import usePokedexDetail from './usePokedexDetail';

const formatLabel = (value: string): string => {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
};

const renderTypeBadges = (items: TPokemonTypeRelation[]) => {
  return items.map((item) => (
    <Badge
      key={item.id}
      style={{
        color: item.text_color,
        backgroundColor: item.background_color,
      }}
    >
      {formatLabel(item.name)}
    </Badge>
  ));
};

type PokedexDetailPageProps = {
  id: string;
};

export default function PokedexDetailPage({ id }: PokedexDetailPageProps) {
  const { entry, isLoading, errorMessage } = usePokedexDetail(id);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#e2e8f0_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="h-24 w-24">
            <Pokeball />
          </div>
        </div>
      </main>
    );
  }

  if (!entry || errorMessage) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#e2e8f0_100%)] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load Pokedex detail</Text>
            <Text color="text-red-700">{errorMessage ?? 'Pokedex detail is unavailable.'}</Text>
          </Card>
        </div>
      </main>
    );
  }

  const pokemon = entry.pokemon;
  const imageSrc = pokemon.image || pokemon.external_image;
  const statItems = [
    { label: 'HP', value: entry.hp },
    { label: 'Attack', value: entry.attack },
    { label: 'Defense', value: entry.defense },
    { label: 'Speed', value: entry.speed },
    { label: 'Sp. Atk', value: entry.special_attack },
    { label: 'Sp. Def', value: entry.special_defense },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#e2e8f0_100%)] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <Image src={imageSrc} alt={pokemon.name} size="xl" fit="contain" className="mx-auto h-72 w-full" />
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <div className="space-y-2">
                <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                  Pokedex No. {String(pokemon.order).padStart(4, '0')}
                </Text>
                <Text as="h1" className="capitalize">{pokemon.name}</Text>
                {entry.discovered_at ? (
                  <Text color="text-slate-500">
                    Discovered at {new Date(entry.discovered_at).toLocaleString()}
                  </Text>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {renderTypeBadges(pokemon.types)}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Level</Text>
                  <Text as="p" size="xl" weight="bold">{entry.level}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Wins / Losses</Text>
                  <Text as="p" size="xl" weight="bold">{entry.wins} / {entry.losses}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Battles</Text>
                  <Text as="p" size="xl" weight="bold">{entry.battles}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Experience</Text>
                  <Text as="p" size="xl" weight="bold">{entry.experience}</Text>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
          <div className="space-y-4">
            <Text as="h3">Species Progression</Text>
            <div className="space-y-3">
              {statItems.map((item) => (
                <BarChart key={item.label} label={item.label} value={item.value} maxValue={255} size="lg" />
              ))}
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <Text as="h3">Possible Moves</Text>
              <div className="flex flex-wrap gap-2">
                {pokemon.moves.length > 0
                  ? pokemon.moves.map((move) => (
                    <Badge key={move.id} tone="secondary">{formatLabel(move.name)}</Badge>
                  ))
                  : <Text color="text-slate-500">No moves available.</Text>}
              </div>
            </div>
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <Text as="h3">Evolution Timeline</Text>
              <div className="flex flex-wrap gap-3">
                <Badge tone="primary">{formatLabel(pokemon.name)}</Badge>
                {pokemon.evolutions.map((evolution) => (
                  <Badge key={evolution.id} tone="secondary">{formatLabel(evolution.name)}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
