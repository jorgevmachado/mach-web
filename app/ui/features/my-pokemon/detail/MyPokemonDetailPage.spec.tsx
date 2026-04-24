import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import MyPokemonDetailPage from './MyPokemonDetailPage';

const myPokemonDetailHookMock = jest.fn();

jest.mock('./useMyPokemonDetail', () => ({
  __esModule: true,
  default: (...args: unknown[]) => {
    return myPokemonDetailHookMock(...args);
  },
}));

jest.mock('@/app/ds/loading/spinner/pokeball', () => function PokeballMock() {
  return <div>pokeball-placeholder</div>;
});

jest.mock('@/app/ds', () => ({
  Badge: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  BarChart: ({ label, value }: { label: string; value: number }) => <div>{`${label}:${value}`}</div>,
  Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => <button onClick={onClick}>{children}</button>,
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Image: ({ alt }: { alt: string }) => <div>{alt}</div>,
  Input: ({
    value,
    onValueChange,
    errorMessage,
  }: {
    value: string;
    onValueChange?: (value: string) => void;
    errorMessage?: string;
  }) => (
    <div>
      <input aria-label="nickname" value={value} onChange={(event) => onValueChange?.(event.target.value)} />
      {errorMessage ? <span>{errorMessage}</span> : null}
    </div>
  ),
  Modal: ({
    children,
    isOpen,
    submitButton,
    closeButton,
  }: {
    children: ReactNode;
    isOpen: boolean;
    submitButton?: { label: string; onClick?: () => void };
    closeButton?: { label: string };
  }) => isOpen ? (
    <div>
      {children}
      {closeButton ? <button>{closeButton.label}</button> : null}
      {submitButton ? <button onClick={submitButton.onClick}>{submitButton.label}</button> : null}
    </div>
  ) : null,
  Text: ({ as: Component = 'p', children }: { as?: keyof JSX.IntrinsicElements; children: ReactNode }) => <Component>{children}</Component>,
}));

describe('MyPokemonDetailPage', () => {
  beforeEach(() => {
    myPokemonDetailHookMock.mockReturnValue({
      entry: {
        id: 'my-1',
        nickname: 'Spark',
        hp: 40,
        attack: 55,
        defense: 30,
        speed: 90,
        special_attack: 50,
        special_defense: 50,
        wins: 1,
        losses: 0,
        battles: 1,
        level: 4,
        captured_at: '2026-01-01T00:00:00.000Z',
        pokemon: {
          id: '1',
          name: 'pikachu',
          order: 25,
          status: 'COMPLETE',
          external_image: 'https://image/pikachu.png',
          types: [],
          evolutions: [],
        },
        moves: [],
      },
      isLoading: false,
      errorMessage: undefined,
      updateNickname: jest.fn(),
      isUpdating: false,
      updateErrorMessage: undefined,
    });
  });

  it('blocks nickname submission shorter than 3 characters', () => {
    render(<MyPokemonDetailPage id="my-1" />);

    fireEvent.click(screen.getByText('Edit nickname'));
    fireEvent.change(screen.getByLabelText('nickname'), { target: { value: 'ab' } });
    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Nickname must be at least 3 characters.')).toBeInTheDocument();
  });
});
