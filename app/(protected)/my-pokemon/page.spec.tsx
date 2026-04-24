import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import MyPokemonPage from './page';

const useMyPokemonListMock = jest.fn();
const pushMock = jest.fn();

jest.mock('@/app/ui/features/my-pokemon', () => ({
  useMyPokemonList: () => useMyPokemonListMock(),
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
  Card: ({ children, onClick, role, tabIndex }: { children: ReactNode; onClick?: () => void; role?: string; tabIndex?: number }) => (
    <div role={role} tabIndex={tabIndex} onClick={onClick}>{children}</div>
  ),
  Filters: () => <div>filters</div>,
  Image: ({ alt }: { alt: string }) => <div>{`image-${alt}`}</div>,
  Pagination: () => <div>pagination</div>,
  Text: ({ as: Component = 'p', children }: { as?: keyof JSX.IntrinsicElements; children: ReactNode }) => (
    <Component>{children}</Component>
  ),
}));

describe('MyPokemonPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
    useMyPokemonListMock.mockReturnValue({
      items: [
        {
          id: 'my-1',
          nickname: 'Spark',
          level: 4,
          wins: 1,
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
      applyInputFilters: jest.fn(),
      clearInputFilters: jest.fn(),
    });
  });

  it('navigates when the related catalog pokemon is complete', () => {
    render(<MyPokemonPage />);

    fireEvent.click(screen.getByRole('button'));

    expect(pushMock).toHaveBeenCalledWith('/my-pokemon/my-1');
  });

  it('does not navigate when the related catalog pokemon is incomplete', () => {
    useMyPokemonListMock.mockReturnValue({
      ...useMyPokemonListMock(),
      items: [
        {
          id: 'my-1',
          nickname: 'Spark',
          level: 4,
          wins: 1,
          losses: 0,
          pokemon: {
            id: '1',
            name: 'pikachu',
            order: 25,
            status: 'INCOMPLETE',
            external_image: 'https://image/pikachu.png',
            types: [],
          },
        },
      ],
    });

    render(<MyPokemonPage />);
    fireEvent.click(screen.queryByRole('button') ?? screen.getByText('Spark'));

    expect(pushMock).not.toHaveBeenCalled();
  });
});
