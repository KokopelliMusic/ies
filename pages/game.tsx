import React, { useEffect, useState } from 'react'
import styles from '../styles/Game.module.sass'
import { formatTime } from '../utils/clock'
import Image from 'next/image'
// import Background from '../public/background.svg'
import { Background } from '../components/background'
import { AdtRad } from '../components/games/adt-rad'
import { CSSTransition } from 'react-transition-group'

enum GameTypes {
  ADT_RAD,
}

function gameTypeToname(type: GameTypes) {
  switch (type) {
    case GameTypes.ADT_RAD:
      return 'Adt rad!'
  }
}

const REFRESH_INTERVAL = 5 // seconds
const GAME_CHECK_INTERVAL = 5 // seconds
// This is the minimum amount of checks that have to have passed before a game can start
const MIN_GAME_INTERVAL = 2 // 60 * 15
const DEFAULT_GAME_CHANCE = 0.2


export default function GameView() {
  const [time, setTime] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const dialogRef = React.useRef<HTMLDialogElement>(null)

  const [songSlide, setSongSlide] = useState<boolean>(false)

  // Game logic
  const [currentGame, setCurrentGame] = useState<GameTypes | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingData | null>(null)
  const [previouslyPlayed, setPreviouslyPlayed] = useState<CurrentlyPlayingData | null>(null)
  const [timeSinceLastGame, setTimeSinceLastGame] = useState<number>(0)
  const [gameChance, setGameChance] = useState<number>(DEFAULT_GAME_CHANCE)
  const [players, setPlayers] = useState<string[]>([])

  const [bg, setBg] = useState<{ fgColor: string, bgColor: string }>({ fgColor: '#80b', bgColor: '#001220' })

  // Setup app
  useEffect(() => {
    const time = localStorage.getItem('time')
    if (time) setTime(parseInt(time))

    const pl = localStorage.getItem('players')
    if (pl) setPlayers(pl.split(','))

    if (pl.length === 0) {
      alert('Nog geen spelers ingesteld. Klik rechtsbovenin om spelers toe te voegen.')
    }

    const interval = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch currently playing
  useEffect(() => {
    refreshSpotify()
      .then(() => setTimeout(() => setLoading(false), 500))
  }, [])

  // React to time
  useEffect(() => {
    if (time === 0) return
    localStorage.setItem('time', time.toString())

    if (time % REFRESH_INTERVAL === 0) {
      refreshSpotify()
    }

    if (time % GAME_CHECK_INTERVAL === 0) {
      if (currentGame !== null) {
        return
      }

      setTimeSinceLastGame(t => t + 1)

      if (timeSinceLastGame > MIN_GAME_INTERVAL) {
        // Now, we have a 20% chance of starting a game
        if (Math.random() > gameChance) {
          console.log('No game this time, but increasing chance for next time. Current chance: ' + gameChance)
          setGameChance(c => c + 0.1)
          return
        }

        setGameChance(DEFAULT_GAME_CHANCE)

        // Start a game!
        const game = Math.floor(Math.random() * Object.keys(GameTypes).length / 2)
        console.log('Game time! We are going to play: ' + game)
        setCurrentGame(game)
      }
    }
  }, [time])

  // Save and load players
  useEffect(() => {
    savePlayers()
  }, [players])

  // A new game starts!
  useEffect(() => {
    if (currentGame === null) {
      setTimeSinceLastGame(0)
      return
    }

    setBg({ fgColor: bg.bgColor, bgColor: bg.fgColor })
  }, [currentGame])

  /*
   * FUNCTIONS 
   */

  function refreshSpotify() {
    return fetch('/api/spotify')
      .then(res => {
        if (res.status !== 200) return
        return res.json()
      })
      .then(data => {
        // When the song has changed, we want to animate the song name
        console.log({ currentlyPlaying, data })
        if (currentlyPlaying?.item.id !== data.item.id) {
          setSongSlide(true)
          setTimeout(() => setSongSlide(false), 5000)
        }

        setPreviouslyPlayed(currentlyPlaying ?? data)
        setTimeout(() => setPreviouslyPlayed(data), 2500)
        setCurrentlyPlaying(data)
      })
  }

  function selectGameComponent(game: GameTypes) {
    switch (game) {
      case GameTypes.ADT_RAD:
        return <AdtRad players={players} time={time} done={gameDone} />
    }
  }

  function savePlayers() {
    localStorage.setItem('players', players.join(','))
  }

  function gameDone() {
    setCurrentGame(null)
    setTimeSinceLastGame(0)
  }

  if (loading) return <div className={styles.game}>
    <div className={styles.bg}>
      <Background fgColor={bg.fgColor} bgColor={bg.bgColor} />
    </div>

    <div className={styles.loading}>
      <h1>Invictus Entertainment Systeem</h1>
      <h2>Laden...</h2>
    </div>
  </div>

  return <div className={styles.game}>
    <dialog ref={dialogRef} className={styles.dialog}>
      <h1>Bewerk spelers</h1>
      <div>
        <p>Voer hieronder de spelers in, gescheiden door een komma.</p>
        <p>Huidige spelers:</p>
        <ul>
          {players.map(player => <li key={player}>{player}</li>)}
        </ul>
      </div>

      <div>
        <textarea value={players} onChange={(e) => setPlayers(e.target.value.split(',').map(p => p.trim()))} />
      </div>

      <br />
      <br />

      <div className={styles.buttonGroup}>
        <button onClick={() => dialogRef.current?.close()}>Opslaan</button>
        <button onClick={() => dialogRef.current?.close()}>Sluiten</button>
      </div>

    </dialog>

    <div className={styles.bg}>
      <Background />
    </div>

    <div className={styles.header}>
      <div className={styles.clock}>
        <button className={styles.editButton} onClick={() => dialogRef.current?.showModal()}>Bewerken</button>
      </div>

      {currentGame !== null ?
        <h1 key={currentGame} className={styles.fadeIn}>
          {gameTypeToname(currentGame)}
        </h1>
        :
        <h1 className={styles.fadeIn}>
          Invictus Entertainment Systeem
        </h1>
      }

      <p className={styles.clock}>
        {formatTime(time)}
      </p>
    </div>

    {currentGame !== null ?
      <main className={`${styles.main} ${styles.fadeIn}`} key={currentGame}>
        {selectGameComponent(currentGame)}
      </main>
      :
      <main className={`${styles.main} ${songSlide ? styles.slide : ''}`}>
        <SpotifyView currentlyPlaying={previouslyPlayed} key={currentlyPlaying?.item?.id ?? 'id'} />
      </main>
    }

  </div>
}

function SpotifyView({ currentlyPlaying }: { currentlyPlaying: CurrentlyPlayingData | null }) {
  if (!currentlyPlaying) return <div className={styles.notPlaying}>
    <h1>Begin met iets afspelen op Spotify!</h1>
  </div>

  return <div className={styles.spotify}>
    <div className={styles.image}>
      <img src={currentlyPlaying?.item.album.images[0].url ?? './missing.jpg'} alt="cover" width={320} height={320} />
    </div>

    <div className={styles.artistInfo}>
      <h1>{currentlyPlaying?.item.name}</h1>
      <h2>{currentlyPlaying?.item.artists.map(a => a.name).join(', ')}</h2>
    </div>
  </div>
}