import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../../store/SettingsSlice'
import { getRandomPunishment } from '../../utils/punish'

const words = [
  'Huts',
  'Misschien',
  'Kan',
  'Bier',
  'Naut',
  'Colosseum',
  'Klok',
  'Invictus',
  'Fles',
  'Frikandel',
  'Ja',
  'Willem-Alexander',
  'Bouwkavel',
  'Ketel 1 Ambachtelijke graanjenever',
]

export function SayNoEvil(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const punishment = useRef<string>(getRandomPunishment())
  const settings = useSelector(selectSettingsState)

  const [word, setWord] = useState<string>('huts')

  useEffect(() => {
    // Select a random word from the words array
    const index = Math.floor(Math.random() * words.length)
    setWord(words[index])
  }, [])

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log(`[SayNoEvil] Done!`)
      props.done()
    }
  }, [props])


  return <div className={styles.main}>
    <h1>&ldquo;<span>{word}</span>&bdquo;</h1>

    <h2>Dit woord mag de komende tijd niet meer gezegd worden</h2>

    <h3>Anders dan <span>{punishment.current}</span></h3>
  </div>
}