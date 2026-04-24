import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import PokedexPage from './page';

const usePokedexListMock = jest.fn();
const pushMock = jest.fn();

jest.mock('@/app/ui/features/pokedex', () => ({
  usePokedexList: () => usePokedexListMock(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@/app/ds/loading/spinner/pokeball', () => function PokeballMock() {
  return <div>pokeball-placeholder</div>;
});

jest.mock('@/app/ds', () => ({
  Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => <button onClick={onClick}>{children}</button>,
  Card: ({ children, onClick, role, tabIndex }: { children: ReactNode; onClick?: () => void; role?: string; tabIndex?: number }) => (
    <div role={role} tabIndex={tabIndex} onClick={onClick}>{children}</div>
  ),
  Filters: () => <div>filters</div>,
  Image: ({ alt }: { alt: string }) => <div>{`image-${alt}`}</div>,
  Pagination: () => <div>pagination</div>,
  Text: ({ as: Component = 'p', children, className }: { as?: keyof JSX.IntrinsicElements; children: ReactNode; className?: string }) => (
    <Component className={className}>{children}</Component>
  ),
}));

describe('PokedexPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
    usePokedexListMock.mockReturnValue({
      items: [
        {
          id: 'entry-1',
          discovered: false,
          level: 1,
          wins: 0,
          losses: 0,
          pokemon: {
            id: '1',
            name: 'pikachu',
            order: 25,
            status: 'COMPLETE',
            external_image: 'https://image/pikachu.png',
            types: [],
          },
        },
      ],
      meta: {
        total: 1,
        limit: 12,
        offset: 0,
        total_pages: 1,
        current_page: 1,
      },
      isLoading: false,
      inputFilters: [],
      applyInputFilters: jest.fn(),
      clearInputFilters: jest.fn(),
      errorMessage: undefined,
      goToPage: jest.fn(),
      reload: jest.fn(),
      filters: {},
      applyFilters: jest.fn(),
      clearFilters: jest.fn(),
      updateInputFilters: jest.fn(),
      trainer: {
        id: 'trainer-1',
        user_id: 'user-1',
        pokeballs: 10,
        capture_rate: 50,
        pokedex_status: 'READY',
        created_at: '2026-01-01T00:00:00.000Z',
      },
      trainerErrorMessage: undefined,
      isTrainerLoading: false,
      retryInitialization: jest.fn(),
      isRetrying: false,
    });
  });

  it('renders undiscovered cards with hidden presentation', () => {
    render(<PokedexPage />);

    expect(screen.getByText('Not Discovered')).toBeInTheDocument();
    expect(screen.getByText('Unknown Species')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'undiscovered pokemon' })).toBeInTheDocument();
  });

  it('shows retry action when trainer initialization failed', () => {
    const retryInitialization = jest.fn();
    usePokedexListMock.mockReturnValue({
      ...usePokedexListMock(),
      items: [],
      trainer: {
        id: 'trainer-1',
        user_id: 'user-1',
        pokeballs: 10,
        capture_rate: 50,
        pokedex_status: 'FAILED',
        created_at: '2026-01-01T00:00:00.000Z',
      },
      retryInitialization,
    });

    render(<PokedexPage />);
    fireEvent.click(screen.getByText('Retry initialization'));

    expect(retryInitialization).toHaveBeenCalled();
  });
});
