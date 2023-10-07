import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../store/SettingsSlice'
import { usePlayers } from '../components/usePlayers'

export function StressPong(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)

  const deLul = useRef(usePlayers(4))

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[StressPong] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1>{
      deLul.current.map((player, index) => {
        if (index === deLul.current.length - 1) return <span>{player}</span>
        else return <>
          <span>{player}</span>
          <span style={{ color: 'white' }}>, </span>
        </>
      })
    }</h1>

    <h2>Gefeliciteerd, jullie gaan een potje <span>stresspong</span> spelen!</h2>
  </div>
}