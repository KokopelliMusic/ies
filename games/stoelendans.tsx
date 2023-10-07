import { useEffect, useRef } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../store/SettingsSlice'

export function Stoelendans(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[Stoelendans] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>Stoelendans</span></h1>

    <h2>Wissel allemaal van <span>stoel</span>!</h2>
  </div>
}