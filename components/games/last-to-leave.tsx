import { useEffect, useRef } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../../store/SettingsSlice'

export function LastToLeave(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[LastToLeave] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>NL Alert</span></h1>

    <h2>De eerste persoon die de ruimte/tuin verlaat vouwt een <span>bak</span></h2>
  </div>
}