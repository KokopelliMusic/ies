import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Player } from '../types/game'

export const Players = atomWithStorage<Player[]>('ies-players', [])
export const PlayerNames = atom((get) => get(Players).map(p => p.name))