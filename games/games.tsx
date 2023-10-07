import { SokkenCheck } from './sokken-check'
import { SnakeEyes } from './snake-eyes'
import { Game } from '../types/game'

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
    component: SokkenCheck,
  }),
  g({
    name: 'Snake Eyes!',
    id: 'snake-eyes',
    component: SnakeEyes
  })
]