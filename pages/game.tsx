import React, { useEffect } from 'react'
import styles from '../styles/Game.module.sass'
import { formatTime } from '../utils/clock'

export function GameView() {
  const [time, setTime] = React.useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  return <div className={styles.game}>
    <div className={styles.header}>
      <div />

      <h1>Invictus Entertainment Systeem</h1>

      <p className={styles.clock}>
        {formatTime(time)}
      </p>
    </div>

    <main className={styles.main}>
      <h1>oliver trekt een bak</h1>
    </main>
  </div>
}