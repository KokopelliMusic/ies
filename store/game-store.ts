import { AVAILABLE_GAMES } from '../games/games'
import { atomWithStorage } from 'jotai/utils'

export const CurrentSelectedGames = atomWithStorage('ies-games', AVAILABLE_GAMES)
