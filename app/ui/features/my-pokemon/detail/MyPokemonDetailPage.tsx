'use client';

import { useMemo, useState } from 'react';

import { Badge, BarChart, Button, Card, Image, Input, Modal, Text } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import type { TPokemonTypeRelation } from '@/app/ui/features/pokemon/types';

import useMyPokemonDetail from './useMyPokemonDetail';

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

type MyPokemonDetailPageProps = {
  id: string;
};

export default function MyPokemonDetailPage({ id }: MyPokemonDetailPageProps) {
  const { entry, isLoading, errorMessage, updateNickname, isUpdating, updateErrorMessage } = useMyPokemonDetail(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);

  const pokemon = entry?.pokemon;
  const imageSrc = pokemon ? (pokemon.image || pokemon.external_image) : '';

  const statItems = useMemo(() => {
    if (!entry) {
      return [];
    }

    return [
      { label: 'HP', value: entry.hp },
      { label: 'Attack', value: entry.attack },
      { label: 'Defense', value: entry.defense },
      { label: 'Speed', value: entry.speed },
      { label: 'Sp. Atk', value: entry.special_attack },
      { label: 'Sp. Def', value: entry.special_defense },
    ];
  }, [entry]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_45%,#fffbeb_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center">
          <div className="h-24 w-24">
            <Pokeball />
          </div>
        </div>
      </main>
    );
  }

  if (!entry || !pokemon || errorMessage) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_45%,#fffbeb_100%)] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load captured Pokemon</Text>
            <Text color="text-red-700">{errorMessage ?? 'Captured Pokemon detail is unavailable.'}</Text>
          </Card>
        </div>
      </main>
    );
  }

  const handleOpenModal = () => {
    setNicknameDraft(entry.nickname);
    setValidationMessage(undefined);
    setIsModalOpen(true);
  };

  const handleSubmitNickname = async () => {
    const trimmed = nicknameDraft.trim();
    if (trimmed.length < 3) {
      setValidationMessage('Nickname must be at least 3 characters.');
      return;
    }

    await updateNickname(trimmed);
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_45%,#fffbeb_100%)] px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <Image src={imageSrc} alt={pokemon.name} size="xl" fit="contain" className="mx-auto h-72 w-full" />
          </Card>

          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                    Captured Instance
                  </Text>
                  <Text as="h1">{entry.nickname}</Text>
                  <Text color="text-slate-500" className="capitalize">{pokemon.name}</Text>
                </div>

                <Button appearance="outline" tone="secondary" onClick={handleOpenModal}>
                  Edit nickname
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {renderTypeBadges(pokemon.types)}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card variant="tonal" rounded="xl" className="bg-white">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Level</Text>
                  <Text as="p" size="xl" weight="bold">{entry.level}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-white">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Wins / Losses</Text>
                  <Text as="p" size="xl" weight="bold">{entry.wins} / {entry.losses}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-white">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Battles</Text>
                  <Text as="p" size="xl" weight="bold">{entry.battles}</Text>
                </Card>
                <Card variant="tonal" rounded="xl" className="bg-white">
                  <Text as="small" color="text-slate-500" weight="semibold" className="uppercase tracking-[0.2em]">Captured At</Text>
                  <Text as="p" size="sm" weight="bold">{new Date(entry.captured_at).toLocaleDateString()}</Text>
                </Card>
              </div>
            </div>
          </Card>
        </section>

        <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
          <div className="space-y-4">
            <Text as="h3">Current Statistics</Text>
            <div className="space-y-3">
              {statItems.map((item) => (
                <BarChart key={item.label} label={item.label} value={item.value} maxValue={300} size="lg" />
              ))}
            </div>
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card variant="elevated" rounded="2xl" className="border border-white/80 bg-white/90">
            <div className="space-y-4">
              <Text as="h3">Equipped Moves</Text>
              <div className="grid gap-3">
                {entry.moves.map((move) => (
                  <Card key={move.id} variant="tonal" rounded="xl" className="bg-amber-50/70">
                    <div className="space-y-2">
                      <Text as="h4">{formatLabel(move.name)}</Text>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="secondary">{formatLabel(move.type)}</Badge>
                        <Badge tone="info">{formatLabel(move.damage_class)}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
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

      <Modal
        title="Edit nickname"
        subtitle="Nicknames must have at least 3 characters."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeButton={{ label: 'Cancel' }}
        submitButton={{
          label: 'Save',
          isLoading: isUpdating,
          onClick: handleSubmitNickname,
        }}
      >
        <div className="space-y-3">
          <Input
            value={nicknameDraft}
            onValueChange={(value) => {
              setNicknameDraft(value);
              setValidationMessage(undefined);
            }}
            placeholder="Nickname"
            errorMessage={validationMessage ?? updateErrorMessage}
          />
        </div>
      </Modal>
    </main>
  );
}
