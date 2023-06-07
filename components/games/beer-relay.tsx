import { useEffect, useRef, useState } from 'react'
import styles from '../../styles/games/text.module.sass'
import { useSelector } from 'react-redux'
import { selectSettingsState } from '../../store/SettingsSlice'
import { usePlayers } from '../usePlayers'
import { getRandomElement } from '../../utils/random'

const teamnames = [
  "De Bierbrouwers",
  "De Hoppende Helden",
  "Het Schuimende Squadron",
  "De Goudgele Gladiatoren",
  "De Biervluchtelingen",
  "De Snel-slok Squad",
  "De Bierwervelwinden",
  "Het Pils Ploegje",
  "De Bierige Bende",
  "De Huppende Hoptoppers",
  "De Bierbazen",
  "De Hoppy Heroes",
  "De Pint Partij",
  "Het Gulzige Genootschap",
  "De Slobberende Strijders",
  "De Bierbuik Brigade",
  "De Schuimige Smullers",
  "De Hopscheppers",
  "De Dorstige Draakjes",
  "Het Bierspektakel",
  "De Gorgelende Glazen",
  "De Hopgekke Hemelbestormers",
  "De Bierkoningen",
  "De Hopsige Happers",
  "Het Bierfestijn",
  "De Proostende Pretmakers"
];

export function BeerRelay(props: GameProps) {
  const beginTime = useRef<number>(props.time)
  const settings = useSelector(selectSettingsState)

  const deLul = useRef(usePlayers(2, 8, true))

  const team1 = useRef(getRandomElement(teamnames))
  const team2 = useRef(getRandomElement(teamnames))

  useEffect(() => {
    // After 60 seconds, the game is done
    if ((props.time - beginTime.current) > settings.timeOnScreen) {
      console.log('[BeerRelay] Done!')
      props.done()
    }
  }, [props])

  return <div className={styles.main}>
    <h1><span>Bier</span>estafette!</h1>

    <h2>{team1.current}</h2>
    <Filter players={deLul.current} min={0} max={deLul.current.length / 2} />
    <h2>{team2.current}</h2>
    <Filter players={deLul.current} min={deLul.current.length / 2} max={deLul.current.length} />
  </div>
}

type FilterProps = {
  players: string[]
  min: number
  max: number
}

function Filter(props: FilterProps) {
  const p = useRef(props.players.slice(props.min, props.max))

  return <h3 style={{ marginTop: '1rem' }}>
    {p.current.map((player, idx) => {
      if (idx === p.current.length - 1) return <span className={styles.namespan}>{player}</span>
      else return <>
        <span className={styles.namespan}>{player}</span>
        <span style={{ color: 'white' }}>, </span>
      </>
    })}
  </h3>
}