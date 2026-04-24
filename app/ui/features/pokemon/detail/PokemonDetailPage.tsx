'use client';

import { useEffect, useState } from 'react';

import { Badge, BarChart, Card, Image, Text } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import type { TPokemonDetail, TPokemonTypeRelation } from '../types';
import usePokemonDetail from './usePokemonDetail';

const MOVES_PAGE_SIZE = 2;

const formatLabel = (value: string): string => {
  return value
    .split('-')
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
};

const formatNumber = (value?: number | null): string => {
  if (typeof value !== 'number') {
    return 'Unknown';
  }

  return value.toString();
};

const buildSubtitle = (pokemon: TPokemonDetail): string | undefined => {
  const items = [
    pokemon.habitat ? `Habitat ${formatLabel(pokemon.habitat)}` : undefined,
    pokemon.growth_rate?.name ? `Growth ${formatLabel(pokemon.growth_rate.name)}` : undefined,
    pokemon.shape_name ? `Shape ${formatLabel(pokemon.shape_name)}` : undefined,
  ].filter(Boolean);

  return items.length > 0 ? items.join(' • ') : undefined;
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

type PokemonDetailPageProps = {
  name: string;
};

export default function PokemonDetailPage({ name }: PokemonDetailPageProps) {
  const { pokemon, isLoading, errorMessage } = usePokemonDetail(name);
  const [visibleMoves, setVisibleMoves] = useState<number>(MOVES_PAGE_SIZE);

  useEffect(() => {
    setVisibleMoves(MOVES_PAGE_SIZE);
  }, [pokemon?.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="h-24 w-24">
            <Pokeball />
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage || !pokemon) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load Pokemon details</Text>
            <Text color="text-red-700">{errorMessage ?? 'Pokemon details are unavailable.'}</Text>
          </Card>
        </div>
      </main>
    );
  }

  const subtitle = buildSubtitle(pokemon);
  const imageSrc = pokemon.image || pokemon.external_image;
  const statItems = [
    { label: 'HP', value: pokemon.hp ?? 0 },
    { label: 'Attack', value: pokemon.attack ?? 0 },
    { label: 'Defense', value: pokemon.defense ?? 0 },
    { label: 'Speed', value: pokemon.speed ?? 0 },
    { label: 'Sp. Atk', value: pokemon.special_attack ?? 0 },
    { label: 'Sp. Def', value: pokemon.special_defense ?? 0 },
  ];
  const weaknesses = pokemon.types.flatMap((item) => item.weaknesses);
  const strengths = pokemon.types.flatMap((item) => item.strengths);
  const movesToRender = pokemon.moves.slice(0, visibleMoves);
  const hasMoreMoves = visibleMoves < pokemon.moves.length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_42%,#eef2ff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card
            variant="elevated"
            rounded="2xl"
            className="border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70"
          >
            <div className="rounded-[1.75rem] bg-[radial-gradient(circle_at_top,#eff6ff_0%,#dbeafe_40%,#f8fafc_100%)] p-4">
              <Image
                src={imageSrc}
                alt={pokemon.name}
                size="xl"
                fit="contain"
                className="mx-auto h-72 w-full"
              />
            </div>
          </Card>

          <Card
            variant="elevated"
            rounded="2xl"
            className="border border-white/80 bg-white/90 shadow-xl shadow-slate-200/70"
          >
            <div className="flex h-full flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                    No. {String(pokemon.order).padStart(4, '0')}
                  </Text>
                  <Text as="h1" className="capitalize">
                    {pokemon.name}
                  </Text>
                  {subtitle ? (
                    <Text color="text-slate-600">{subtitle}</Text>
                  ) : null}
                </div>

                <Badge tone="success" variant="soft" className="px-3 py-2">
                  {pokemon.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {renderTypeBadges(pokemon.types)}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Height</Text>
                  <Text as="p" size="xl" weight="bold">{formatNumber(pokemon.height)}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Weight</Text>
                  <Text as="p" size="xl" weight="bold">{formatNumber(pokemon.weight)}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Habitat</Text>
                  <Text as="p" size="xl" weight="bold">{pokemon.habitat ? formatLabel(pokemon.habitat) : 'Unknown'}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-slate-50">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Hatch Counter</Text>
                  <Text as="p" size="xl" weight="bold">{formatNumber(pokemon.hatch_counter)}</Text>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <Text as="h3">Statistics</Text>
              <div className="space-y-3">
                {statItems.map((item) => (
                  <BarChart
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    maxValue={255}
                    size="lg"
                  />
                ))}
              </div>
            </div>
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <Text as="h3">Abilities</Text>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <Badge key={ability.id} tone={ability.is_hidden ? 'warning' : 'primary'}>
                    {formatLabel(ability.name)}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <Text as="h4">Growth Rate</Text>
                <Text color="text-slate-700">
                  {pokemon.growth_rate ? formatLabel(pokemon.growth_rate.name) : 'Unknown'}
                </Text>
                {pokemon.growth_rate?.description ? (
                  <Text color="text-slate-500">{pokemon.growth_rate.description}</Text>
                ) : null}
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <Text as="h3">Weaknesses</Text>
              <div className="flex flex-wrap gap-2">
                {weaknesses.length > 0 ? renderTypeBadges(weaknesses) : <Text color="text-slate-500">No weaknesses available.</Text>}
              </div>
            </div>
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <Text as="h3">Strengths</Text>
              <div className="flex flex-wrap gap-2">
                {strengths.length > 0 ? renderTypeBadges(strengths) : <Text color="text-slate-500">No strengths available.</Text>}
              </div>
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <Text as="h3">Moves</Text>
                  <Text color="text-slate-500">
                    Highlighted attacks in progressive batches so the page keeps its rhythm.
                  </Text>
                </div>

                <Badge tone="secondary" variant="soft">
                  {pokemon.moves.length} total
                </Badge>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {movesToRender.map((move, index) => (
                  <Card
                    key={move.id}
                    variant="tonal"
                    rounded="xl"
                    className={index % 2 === 0 ? 'bg-slate-50' : 'bg-sky-50/70'}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <Text as="h4" className="capitalize">{formatLabel(move.name)}</Text>
                          <div className="flex flex-wrap gap-2">
                            <Badge tone="secondary">{formatLabel(move.type)}</Badge>
                            <Badge tone="info">{formatLabel(move.damage_class)}</Badge>
                          </div>
                        </div>

                        <div className="rounded-xl bg-white/80 px-3 py-2 text-right shadow-sm">
                          <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.16em]">
                            Priority
                          </Text>
                          <Text as="p" weight="bold" color="text-slate-900">
                            {move.priority}
                          </Text>
                        </div>
                      </div>

                      <Text color="text-slate-500">
                        Power {move.power} • Accuracy {move.accuracy} • PP {move.pp}
                      </Text>
                      <Text color="text-slate-600" lineClamp={2}>
                        {move.short_effect || move.effect}
                      </Text>
                    </div>
                  </Card>
                ))}
              </div>

              {hasMoreMoves ? (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleMoves((currentValue) => {
                        return Math.min(currentValue + MOVES_PAGE_SIZE, pokemon.moves.length);
                      });
                    }}
                    className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100"
                  >
                    Ver mais 2 movimentos
                  </button>
                </div>
              ) : null}
          </div>
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <Text as="h3">Evolution Timeline</Text>
              <div className="flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-center">
                <Card variant="tonal" rounded="xl" className="bg-sky-50 ring-2 ring-sky-200">
                  <div className="flex items-center gap-4">
                    <Image src={imageSrc} alt={pokemon.name} size="sm" fit="contain" className="h-20 w-20" />
                    <div>
                      <Text as="h4" className="capitalize">{pokemon.name}</Text>
                      <Text color="text-slate-500">Current Pokemon</Text>
                    </div>
                  </div>
                </Card>

                {pokemon.evolutions.map((evolution) => {
                  const evolutionImage = evolution.image || evolution.external_image;
                  return (
                    <div key={evolution.id} className="flex items-center gap-4">
                      <Text as="span" color="text-slate-300" size="3xl">→</Text>
                      <Card variant="tonal" rounded="xl" className="bg-slate-50">
                        <div className="flex items-center gap-4">
                          <Image src={evolutionImage} alt={evolution.name} size="sm" fit="contain" className="h-20 w-20" />
                          <div>
                            <Text as="h4" className="capitalize">{evolution.name}</Text>
                            <Text color="text-slate-500">{evolution.status}</Text>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
