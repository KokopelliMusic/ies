import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectPlayerState } from '../../store/PlayerSlice'
import { selectSettingsState } from '../../store/SettingsSlice'

export function DuctTapeAlarm(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const players = useSelector(selectPlayerState)
  const settings = useSelector(selectSettingsState)

  const [deLul, isDeLul] = useState<string[]>([])

  useEffect(() => {
    // Shuffle array
    const shuffled = Array.from(players).sort(() => 0.5 - Math.random());

    const selected = shuffled.slice(0, 2);

    isDeLul(selected)
  }, [])

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[DuctTapeAlarm] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>{deLul[0]}</span> & <span>{deLul[1]}</span></h1>

    <h2>Pak de <span>ductape</span> maar!</h2>
  </div>
}