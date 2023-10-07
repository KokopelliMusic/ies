import { SokkenCheck } from './sokken-check'
import { SnakeEyes } from './snake-eyes'
import { Game, Player } from '../types/game'

function g(obj: Partial<Game>): Game {
  return Object.assign({
    name: 'Unknown game',
    id: 'game-unknown',
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
    players: false
  }),
  g({
    name: 'Snake Eyes!',
    id: 'snake-eyes',
    players: {
      minimum: 1,
      maximum: 1
    }
  })
]

export function getGameComponent(game: Game, players: Player[]) {
  switch (game.id) {
    case 'sokken-check':
      return <SokkenCheck />
    case 'snake-eyes':
      return <SnakeEyes players={players} />
  }
}