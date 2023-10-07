import { AdtRad } from './adt-rad'
import { NoSocks } from './no-socks'
import { SnakeEyes } from './snake-eyes'

type Game = {
  name: string
  id: string
  component: (props: GameProps) => JSX.Element,
  active: boolean,
  // If undefined, then >2 players
  players: {
    minimum: number,
    maximum: number
  }
}

function g(obj: Partial<Game>): Game {
  return Object.assign({
    name: 'Unknown game',
    id: 'game-unknown',
    component: null,
    active: true,
    players: {
      minimum: 2,
      maximum: 99,
    }
  }, obj)
}

export const AVAILABLE_GAMES: Game[] = [
  // g({
  //   name: 'Adt rad!',
  //   id: 'adt-rad',
  //   component: AdtRad,
  // }),
  g({
    name: 'Sokken check!',
    id: 'sokken-check',
    component: NoSocks,
  }),
  g({
    name: 'Snake Eyes!',
    id: 'snake-eyes',
    component: SnakeEyes
  })
]