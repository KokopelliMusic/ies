import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/adt-rad.module.sass'

export function AdtRad(props: GameProps) {
  // Random number between 10 and 90
  const [randomDistance, _] = useState(Math.floor(Math.random() * 90) + 10)


  return <div className={styles.main}>
    <div className={styles.pointer} />

    <div className={`${styles.wheel} ${styles.spin}`} style={{ "--spin-distance": `-${randomDistance}%` }}>
      {Array.from(Array(10).keys()).map(() => {
        return props.players.map(p => <div key={p} className={styles.player}>
          <h1>{p}</h1>
        </div>)
      })}
    </div>
  </div>
}