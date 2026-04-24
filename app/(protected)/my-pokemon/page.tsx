'use client';

import { Card, Filters, Image, Pagination, Text } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import { useMyPokemonList } from '@/app/ui/features/my-pokemon';
import { useRouter } from 'next/navigation';

export default function MyPokemonPage() {
  const router = useRouter();
  const {
    items,
    meta,
    isLoading,
    inputFilters,
    applyInputFilters,
    clearInputFilters,
    errorMessage,
    goToPage,
  } = useMyPokemonList();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#fff7ed_45%,#fffbeb_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/70">
          <div className="space-y-2">
            <Text as="h1">My Pokemons</Text>
            <Text color="text-slate-600" className="max-w-2xl">
              Review each captured instance with its own nickname, progression, and battle-ready move set.
            </Text>
          </div>
        </section>

        <Filters
          ariaLabel="My Pokemon filters"
          filters={inputFilters}
          onApply={applyInputFilters}
          onClear={clearInputFilters}
        />

        {errorMessage ? (
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load captured Pokemon</Text>
            <Text color="text-red-700">{errorMessage}</Text>
          </Card>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((entry) => {
            const pokemon = entry.pokemon;
            const imageSrc = pokemon.image || pokemon.external_image;
            const isNavigable = pokemon.status === 'COMPLETE';

            return (
              <Card
                key={entry.id}
                as="div"
                variant="elevated"
                rounded="2xl"
                hoverEffect={isNavigable ? 'lift' : 'none'}
                interactive={isNavigable}
                role={isNavigable ? 'button' : undefined}
                tabIndex={isNavigable ? 0 : -1}
                onClick={() => {
                  if (!isNavigable) {
                    return;
                  }

                  router.push(`/my-pokemon/${entry.id}`);
                }}
                className="border border-white/80 bg-white/90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                      {pokemon.name}
                    </Text>
                    <Text as="h3">{entry.nickname}</Text>
                    <Text color="text-slate-500">
                      Level {entry.level} • {entry.wins}W / {entry.losses}L
                    </Text>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type) => (
                        <span
                          key={type.id}
                          className="rounded-full px-2 py-1 text-xs font-semibold"
                          style={{
                            color: type.text_color,
                            backgroundColor: type.background_color,
                          }}
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-2 shadow-inner shadow-slate-100">
                    {isNavigable ? (
                      <Image src={imageSrc} alt={pokemon.name} size="sm" fit="contain" className="h-28 w-28" />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center" role="img" aria-label={`${pokemon.name} incomplete`}>
                        <div className="h-16 w-16">
                          <Pokeball />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <Pagination
          currentPage={meta.current_page}
          totalPages={meta.total_pages}
          onPageChange={goToPage}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
