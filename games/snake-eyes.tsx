import { useRef } from 'react'
import styles from '../styles/games/text.module.sass'
import { getRandomPunishmentSecondPerson } from '../utils/punish'
import { GameProps } from '../types/game'

export function SnakeEyes(props: GameProps) {
  const punishment = useRef<string>(getRandomPunishmentSecondPerson())

  return <div className={styles.main}>
    <h1><span>{props.players[0].name}</span></h1>

    <h2>Niemand mag jou meer aankijken tot het volgende spel!</h2>

    <h3>Anders dan <span>{punishment.current}</span></h3>
  </div>
}