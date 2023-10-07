import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectPlayerState } from '../store/PlayerSlice'
import { selectSettingsState } from '../store/SettingsSlice'
import { getRandomPunishmentSecondPerson } from '../utils/punish'
import { usePlayers } from '../components/usePlayers'

export function SnakeEyes(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)

  const punishment = useRef<string>(getRandomPunishmentSecondPerson())
  const deLul = useRef(usePlayers(1))

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[SnakeEyes] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>{deLul.current}</span></h1>

    <h2>Niemand mag jou meer aankijken tot het volgende spel!</h2>

    <h3>Anders dan <span>{punishment.current}</span></h3>
  </div>
}