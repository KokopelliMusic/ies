import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/adt-rad.module.sass'
import Image from 'next/image'
import { selectSettingsState } from '../store/SettingsSlice'
import { useSelector } from 'react-redux'
import { selectPlayerState } from '../store/PlayerSlice'

export function AdtRad(props: GameProps) {
  // Random number between 30.00 and 90.99
  const [randomDistance, _] = useState((Math.round(Math.random() * 6100) + 3000) / 100)
  const players = useSelector(selectPlayerState)
  const settings = useSelector(selectSettingsState)

  const beginTime = useRef<number>(props.time)

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[AdtRad] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <div className={styles.pointer}>
      <Image src="/grolsch.avif" width={100} height={100} alt="pointer" />
    </div>

    <div className={`${styles.wheel} ${styles.spin}`} style={{ "--spin-distance": `-${randomDistance}%` }}>
      {Array.from(Array(10).keys()).map(() => {
        return players.map(p => <div key={p} className={styles.player}>
          <h1>{p}</h1>
        </div>)
      })}
    </div>
  </div>
}