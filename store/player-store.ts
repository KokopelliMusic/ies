import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Player } from '../types/game'

export const Players = atomWithStorage<Player[]>('ies-players', [])
export const PlayerNames = atom((get) => get(Players).map(p => p.name))

export const PlayerRanking = atom((get) => {
  const ps = get(Players)

  // Sort the players randomly, where lower timesSelected has more chance of ending up
  // at the beginning of the array
  return ps.sort((a, b) => Math.random() * (a.timesSelected - b.timesSelected))
})