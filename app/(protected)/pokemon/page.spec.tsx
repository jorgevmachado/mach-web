import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import PokemonPage from './page';

const usePokemonListMock = jest.fn();
const pushMock = jest.fn();

jest.mock('@/app/ui/features/pokemon', () => ({
  usePokemonList: () => usePokemonListMock(),
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
  Card: ({
    children,
    onClick,
    onKeyDown,
    role,
    tabIndex,
  }: {
    children: ReactNode;
    onClick?: () => void;
    onKeyDown?: (event: { key: string; preventDefault: () => void }) => void;
    role?: string;
    tabIndex?: number;
  }) => (
    <div
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={(event) => onKeyDown?.({
        key: event.key,
        preventDefault: () => event.preventDefault(),
      })}
    >
      {children}
    </div>
  ),
  Filters: () => <div>filters</div>,
  Image: ({ alt }: { alt: string }) => <div>{`image-${alt}`}</div>,
  Pagination: ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => (
    <div>{`pagination-${currentPage}-${totalPages}`}</div>
  ),
  Text: ({
    as: Component = 'p',
    children,
    className,
  }: {
    as?: keyof JSX.IntrinsicElements;
    children: ReactNode;
    className?: string;
  }) => <Component className={className}>{children}</Component>,
}));

describe('PokemonPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
    usePokemonListMock.mockReturnValue({
      items: [
        {
          id: '1',
          name: 'pikachu',
          order: 25,
          status: 'INCOMPLETE',
          external_image: 'https://image/pikachu.png',
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
    });
  });

  it('renders paginated pokemon cards from the hook result', () => {
    render(<PokemonPage />);

    expect(screen.getByText('Pokemon Catalog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'pikachu' })).toBeInTheDocument();
    expect(screen.getByText('No. 0025')).toBeInTheDocument();
    expect(screen.getByText('INCOMPLETE')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'pikachu placeholder' })).toBeInTheDocument();
    expect(screen.queryByText('image-pikachu')).not.toBeInTheDocument();
    expect(screen.getByText('pagination-1-1')).toBeInTheDocument();
  });

  it('navigates when a complete pokemon card is clicked', () => {
    usePokemonListMock.mockReturnValue({
      items: [
        {
          id: '1',
          name: 'pikachu',
          order: 25,
          status: 'COMPLETE',
          external_image: 'https://image/pikachu.png',
          image: 'https://image/pikachu-sprite.png',
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
    });

    render(<PokemonPage />);

    fireEvent.click(screen.getByRole('button'));

    expect(pushMock).toHaveBeenCalledWith('/pokemon/pikachu');
  });

  it('does not navigate when an incomplete pokemon card is clicked', () => {
    render(<PokemonPage />);

    fireEvent.click(screen.queryByRole('button') ?? screen.getByText('pikachu'));

    expect(pushMock).not.toHaveBeenCalled();
  });
});
