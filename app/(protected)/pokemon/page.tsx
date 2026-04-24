'use client';

import { Card, Filters, Image, Pagination, Text } from '@/app/ds';
import Pokeball from '@/app/ds/loading/spinner/pokeball';
import { usePokemonList } from '@/app/ui/features/pokemon';
import { useRouter } from 'next/navigation';

const STATUS_TONE_MAP: Record<string, string> = {
  COMPLETE: 'text-emerald-700',
  INCOMPLETE: 'text-amber-700',
  ACTIVE: 'text-blue-700',
  INACTIVE: 'text-slate-500',
};

export default function PokemonPage() {
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
  } = usePokemonList();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_45%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/70 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Text as="h1">Pokemon Catalog</Text>
              <Text color="text-slate-600" className="max-w-2xl">
                Browse the protected catalog using the same paginated flow already adopted in the frontend.
              </Text>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <Text as="small" color="text-sky-700" weight="semibold" className="uppercase tracking-[0.24em]">
                Entries loaded
              </Text>
              <Text as="p" size="2xl" weight="bold" color="text-sky-950">
                {meta.total}
              </Text>
            </div>
          </div>
        </section>

        <Filters
          ariaLabel="Pokemon filters"
          filters={inputFilters}
          onApply={(nextFilters) => {
            applyInputFilters(nextFilters);
          }}
          onClear={clearInputFilters}
        />

        {errorMessage ? (
          <Card variant="outlined" rounded="2xl" className="border-red-200 bg-red-50">
            <Text as="h3" color="text-red-800">Could not load Pokemon</Text>
            <Text color="text-red-700">{errorMessage}</Text>
          </Card>
        ) : null}

        {!errorMessage && !isLoading && items.length === 0 ? (
          <Card variant="tonal" rounded="2xl" className="border-dashed border-slate-200 bg-white/70 text-center">
            <Text as="h3">No Pokemon found</Text>
            <Text color="text-slate-600">
              Adjust the name or order filters and try again.
            </Text>
          </Card>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((pokemon) => {
            const imageSrc = pokemon.image || pokemon.external_image;
            const shouldShowPlaceholder = pokemon.status === 'INCOMPLETE';
            const isNavigable = pokemon.status === 'COMPLETE';
            return (
              <Card
                key={pokemon.id}
                as="div"
                variant="elevated"
                rounded="2xl"
                hoverEffect={isNavigable ? 'lift' : 'none'}
                interactive={isNavigable}
                role={isNavigable ? 'button' : undefined}
                tabIndex={isNavigable ? 0 : -1}
                aria-disabled={!isNavigable}
                onClick={() => {
                  if (!isNavigable) {
                    return;
                  }

                  router.push(`/pokemon/${pokemon.name}`);
                }}
                onKeyDown={(event) => {
                  if (!isNavigable) {
                    return;
                  }

                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    router.push(`/pokemon/${pokemon.name}`);
                  }
                }}
                className={isNavigable
                  ? 'border border-white/80 bg-white/90'
                  : 'border border-white/80 bg-white/90 opacity-95'}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Text as="small" color="text-slate-400" weight="semibold" className="uppercase tracking-[0.28em]">
                      No. {String(pokemon.order).padStart(4, '0')}
                    </Text>
                    <Text as="h3" className="capitalize">
                      {pokemon.name}
                    </Text>
                    <Text
                      as="p"
                      weight="semibold"
                      className={STATUS_TONE_MAP[pokemon.status] ?? 'text-slate-600'}
                    >
                      {pokemon.status}
                    </Text>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-2 shadow-inner shadow-slate-100">
                    {shouldShowPlaceholder ? (
                      <div
                        role="img"
                        aria-label={`${pokemon.name} placeholder`}
                        className="flex h-28 w-28 items-center justify-center"
                      >
                        <div className="h-20 w-20">
                          <Pokeball />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={imageSrc}
                        alt={pokemon.name}
                        size="sm"
                        fit="contain"
                        className="h-28 w-28"
                      />
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <div className="pt-2">
          <Pagination
            currentPage={meta.current_page}
            totalPages={meta.total_pages}
            onPageChange={goToPage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}
