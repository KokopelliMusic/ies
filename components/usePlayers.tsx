import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectPlayerState } from '../store/PlayerSlice';

export const usePlayers = (amount: number, maxAmount?: number, even?: boolean) => {
  const playerState = useSelector(selectPlayerState)

  if (maxAmount) {
    amount = Math.min(playerState.length, maxAmount)
  }

  if (even) {
    amount = Math.floor(amount / 2) * 2
  }

  return Array.from(playerState).sort(() => 0.5 - Math.random()).slice(0, amount)
}
