import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Player } from '../types/game'

export const Players = atomWithStorage<Player[]>('ies-players', [])
export const PlayerNames = atom((get) => get(Players).map(p => p.name))

export const PlayerRanking = atom((get) => {
  const ps = get(Players)

  // Now sort the player array by timesSelected
  return ps.sort((a, b) => a.timesSelected - b.timesSelected)
})