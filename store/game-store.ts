import { atom } from 'jotai'
import { AVAILABLE_GAMES } from '../games/games'

export const CurrentSelectedGames = atom(AVAILABLE_GAMES)
