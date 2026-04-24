import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import PokemonDetailPage from './PokemonDetailPage';

const pokemonDetailHookMock = jest.fn();

jest.mock('./usePokemonDetail', () => ({
  __esModule: true,
  default: (name: string) => pokemonDetailHookMock(name),
}));

jest.mock('@/app/ds/loading/spinner/pokeball', () => function PokeballMock() {
  return <div>pokeball-placeholder</div>;
});

jest.mock('@/app/ds', () => ({
  Badge: ({
    children,
    style,
  }: {
    children: ReactNode;
    style?: Record<string, string>;
  }) => <span style={style}>{children}</span>,
  BarChart: ({ label, value }: { label: string; value: number }) => <div>{`${label}:${value}`}</div>,
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Image: ({ alt }: { alt: string }) => <div>{`image-${alt}`}</div>,
  Text: ({
    as: Component = 'p',
    children,
  }: {
    as?: keyof JSX.IntrinsicElements;
    children: ReactNode;
  }) => <Component>{children}</Component>,
}));

describe('PokemonDetailPage', () => {
  beforeEach(() => {
    pokemonDetailHookMock.mockReturnValue({
      isLoading: false,
      errorMessage: undefined,
      reload: jest.fn(),
      pokemon: {
        id: '1',
        name: 'pikachu',
        order: 25,
        status: 'COMPLETE',
        external_image: 'https://image/pikachu.png',
        image: 'https://image/pikachu-sprite.png',
        hp: 35,
        attack: 55,
        defense: 40,
        speed: 90,
        special_attack: 50,
        special_defense: 50,
        height: 4,
        weight: 60,
        habitat: 'forest',
        hatch_counter: 10,
        shape_name: 'quadruped',
        growth_rate: {
          id: 'growth-1',
          url: '/growth-rate/2',
          name: 'medium-fast',
          formula: 'x^3',
          description: 'Medium fast growth.',
        },
        abilities: [
          {
            id: 'ability-1',
            url: '/ability/9',
            order: 1,
            name: 'static',
            slot: 1,
            is_hidden: false,
          },
        ],
        moves: [
          {
            id: 'move-1',
            pp: 30,
            url: '/move/98',
            type: 'normal',
            name: 'quick-attack',
            order: 98,
            power: 40,
            target: 'selected-pokemon',
            effect: 'Inflicts regular damage.',
            priority: 1,
            accuracy: 100,
            short_effect: 'Usually goes first.',
            damage_class: 'physical',
            effect_chance: null,
          },
          {
            id: 'move-2',
            pp: 15,
            url: '/move/9',
            type: 'electric',
            name: 'thunder-punch',
            order: 9,
            power: 75,
            target: 'selected-pokemon',
            effect: 'Inflicts regular damage.',
            priority: 0,
            accuracy: 100,
            short_effect: 'May paralyze the target.',
            damage_class: 'physical',
            effect_chance: 10,
          },
          {
            id: 'move-3',
            pp: 10,
            url: '/move/85',
            type: 'electric',
            name: 'thunderbolt',
            order: 85,
            power: 90,
            target: 'selected-pokemon',
            effect: 'Inflicts regular damage.',
            priority: 0,
            accuracy: 100,
            short_effect: 'May paralyze the target.',
            damage_class: 'special',
            effect_chance: 10,
          },
        ],
        types: [
          {
            id: 'type-1',
            url: '/type/13',
            order: 13,
            name: 'electric',
            text_color: '#212121',
            background_color: '#F8D030',
            weaknesses: [
              {
                id: 'weakness-1',
                name: 'ground',
                text_color: '#f5f5f5',
                background_color: '#bc5e00',
              },
            ],
            strengths: [
              {
                id: 'strength-1',
                name: 'water',
                text_color: '#FFFFFF',
                background_color: '#6890F0',
              },
            ],
          },
        ],
        evolutions: [
          {
            id: '2',
            name: 'raichu',
            order: 26,
            status: 'COMPLETE',
            external_image: 'https://image/raichu.png',
            image: 'https://image/raichu-sprite.png',
          },
        ],
      },
    });
  });

  it('renders the pokemon details experience from the hook result', () => {
    render(<PokemonDetailPage name="pikachu" />);

    expect(screen.getByRole('heading', { level: 1, name: 'pikachu' })).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Abilities')).toBeInTheDocument();
    expect(screen.getByText('Weaknesses')).toBeInTheDocument();
    expect(screen.getByText('Strengths')).toBeInTheDocument();
    expect(screen.getByText('Moves')).toBeInTheDocument();
    expect(screen.getByText('Evolution Timeline')).toBeInTheDocument();
    expect(screen.getByText('Quick Attack')).toBeInTheDocument();
    expect(screen.getByText('Thunder Punch')).toBeInTheDocument();
    expect(screen.queryByText('Thunderbolt')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ver mais 2 movimentos' })).toBeInTheDocument();
    expect(screen.getByText('Ground')).toBeInTheDocument();
    expect(screen.getByText('Water')).toBeInTheDocument();
    expect(screen.getByText('raichu')).toBeInTheDocument();
    expect(screen.getByText('HP:35')).toBeInTheDocument();
  });

  it('reveals more moves progressively', () => {
    render(<PokemonDetailPage name="pikachu" />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver mais 2 movimentos' }));

    expect(screen.getByText('Thunderbolt')).toBeInTheDocument();
  });
});
