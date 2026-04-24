'use client';

import { Button, Card, Filters, Image, Pagination, Text } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import { usePokedexList } from '@/app/ui/features/pokedex';
import { useRouter } from 'next/navigation';

export default function PokedexPage() {
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
    trainer,
    trainerErrorMessage,
    isTrainerLoading,
    retryInitialization,
    isRetrying,
  } = usePokedexList();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#eef2ff_0%,#f8fafc_45%,#e2e8f0_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/70">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Text as="h1">Pokedex</Text>
              <Text color="text-slate-600" className="max-w-2xl">
                Track every species in your trainer archive, even before it has been discovered.
              </Text>
            </div>

            {trainer ? (
              <Card variant="tonal" rounded="xl" className="bg-indigo-50">
                <Text as="small" color="text-indigo-700" weight="semibold" className="uppercase tracking-[0.24em]">
                  Pokedex Status
                </Text>
                <Text as="p" size="xl" weight="bold" color="text-indigo-950">
                  {trainer.pokedex_status}
                </Text>
              </Card>
            ) : null}
          </div>
        </section>

        <Filters
          ariaLabel="Pokedex filters"
          filters={inputFilters}
          onApply={applyInputFilters}
          onClear={clearInputFilters}
        />

        {isTrainerLoading ? (
          <Card variant="outlined" rounded="2xl" className="border-indigo-200 bg-indigo-50">
            <Text color="text-indigo-700">Checking trainer Pokedex status…</Text>
          </Card>
        ) : null}

        {trainer?.pokedex_status === 'INITIALIZING' ? (
          <Card variant="outlined" rounded="2xl" className="border-sky-200 bg-sky-50">
            <Text as="h3" color="text-sky-800">Preparing your Pokedex</Text>
            <Text color="text-sky-700">
              Your species archive is being materialized in the background. This page will fill in as it becomes ready.
            </Text>
          </Card>
        ) : null}

        {trainer?.pokedex_status === 'FAILED' ? (
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <Text as="h3" color="text-red-800">Pokedex initialization failed</Text>
                <Text color="text-red-700">
                  Retry the same trainer initialization flow to continue building the archive.
                </Text>
              </div>

              <Button onClick={() => void retryInitialization()} isLoading={isRetrying}>
                Retry initialization
              </Button>
            </div>
          </Card>
        ) : null}

        {trainerErrorMessage ? (
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load trainer</Text>
            <Text color="text-red-700">{trainerErrorMessage}</Text>
          </Card>
        ) : null}

        {errorMessage ? (
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load Pokedex</Text>
            <Text color="text-red-700">{errorMessage}</Text>
          </Card>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((entry) => {
            const pokemon = entry.pokemon;
            const imageSrc = pokemon.image || pokemon.external_image;

            return (
              <Card
                key={entry.id}
                as="div"
                variant="elevated"
                rounded="2xl"
                hoverEffect={entry.discovered ? 'lift' : 'none'}
                interactive={entry.discovered}
                role={entry.discovered ? 'button' : undefined}
                tabIndex={entry.discovered ? 0 : -1}
                onClick={() => {
                  if (!entry.discovered) {
                    return;
                  }

                  router.push(`/pokedex/${entry.id}`);
                }}
                className="border border-white/80 bg-white/90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                      No. {String(pokemon.order).padStart(4, '0')}
                    </Text>
                    <Text as="h3" className={entry.discovered ? 'capitalize' : 'text-slate-400'}>
                      {entry.discovered ? pokemon.name : 'Unknown Species'}
                    </Text>
                    {entry.discovered ? (
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
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600">
                        Not Discovered
                      </span>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-2 shadow-inner shadow-slate-100">
                    {entry.discovered ? (
                      <Image src={imageSrc} alt={pokemon.name} size="sm" fit="contain" className="h-28 w-28" />
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center" role="img" aria-label="undiscovered pokemon">
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
