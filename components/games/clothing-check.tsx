import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../../store/SettingsSlice'
import { getRandomPunishmentThirdPerson } from '../../utils/punish'

const randomClothing = [
  'broek',
  'sokken',
  'schoenen',
]

const randomColors = [
  'witte',
  'beige',
  'zwarte',
  'blauwe',
  'rare'
]



export function ClothingCheck(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)
  const punishment = useRef<string>(getRandomPunishmentThirdPerson())

  const [piece, setPiece] = useState<string>('')
  const [color, setColor] = useState<string>('')

  useEffect(() => {
    // select a random piece of clothing and color
    setPiece(randomClothing[Math.floor(Math.random() * randomClothing.length)])
    setColor(randomColors[Math.floor(Math.random() * randomColors.length)])
  }, [])

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[ClothingCheck] Done!')
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1><span>Kleding check</span></h1>

    <h2>Iedereen die geen <span>{color} {piece}</span> aan heeft <span className={styles.altspan}>{punishment.current}</span></h2>
  </div>
}