import { useEffect, useRef } from 'react'
import styles from '../../styles/games/text.module.sass'

export function NoSocks(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  // const settings = useSelector(selectSettingsState)

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > 60) {
      console.log('[NoSocks] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>Sokken check</span></h1>

    <h2>Iedereen die op dit moment <span className={styles.altspan}>geen</span> sokken aan heeft vouwt een <span>bak</span></h2>
  </div>
}