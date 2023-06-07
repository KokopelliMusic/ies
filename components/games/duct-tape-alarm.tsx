import { useEffect, useRef } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../../store/SettingsSlice'
import { usePlayers } from '../usePlayers'

export function DuctTapeAlarm(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)

  const deLul = useRef(usePlayers(2))

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[DuctTapeAlarm] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>{deLul.current[0]}</span> & <span>{deLul.current[1]}</span></h1>

    <h2>Pak de ductape maar!</h2>
  </div>
}