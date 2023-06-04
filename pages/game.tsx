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

const REFRESH_INTERVAL = 10 // seconds
const GAME_CHECK_INTERVAL = 5 // seconds
const MIN_GAME_INTERVAL = 60 * 15

export default function GameView() {
  const [time, setTime] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const dialogRef = React.useRef<HTMLDialogElement>(null)

  // Game logic
  const [currentGame, setCurrentGame] = useState<GameTypes | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingData | null>(null)
  const [previouslyPlayed, setPreviouslyPlayed] = useState<CurrentlyPlayingData | null>(null)
  const [timeSinceLastGame, setTimeSinceLastGame] = useState<number>(0)
  const [players, setPlayers] = useState<string[]>([])


  // Setup app
  useEffect(() => {
    const time = localStorage.getItem('time')
    if (time) setTime(parseInt(time))

    loadPlayers()

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
      console.log('Refreshing Spotify')
      refreshSpotify()
    }

    if (time % GAME_CHECK_INTERVAL === 0) {
      setTimeSinceLastGame(t => t + 1)

      if (timeSinceLastGame > MIN_GAME_INTERVAL) {
        // Now, we have a 20% chance of starting a game
        if (Math.random() > 0.2) {
          return
        }

        // 

      }
    }
  }, [time])

  // Save and load players
  useEffect(() => {
    savePlayers()
  }, [players])

  /*
   * FUNCTIONS 
   */

  function refreshSpotify() {
    return fetch('/api/spotify')
      .then(res => res.json())
      .then(data => {
        setPreviouslyPlayed(currentlyPlaying ?? data)
        setTimeout(() => setPreviouslyPlayed(data), 2500)
        setCurrentlyPlaying(data)
      })
  }

  function selectGameComponent(game: GameTypes) {
    switch (game) {
      case GameTypes.ADT_RAD:
        return <AdtRad players={players} time={time} />
    }
  }

  function savePlayers() {
    localStorage.setItem('players', players.join(','))
  }

  function loadPlayers() {
    const players = localStorage.getItem('players')
    if (players) setPlayers(players.split(','))
  }

  if (loading) return <div className={styles.game}>
    <div className={styles.bg}>
      <Background />
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

      <textarea value={players} onChange={(e) => setPlayers(e.target.value.split(',').map(p => p.trim()))} />

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


      <h1>Invictus Entertainment Systeem</h1>

      <p className={styles.clock}>
        {formatTime(time)}
      </p>
    </div>

    <main className={styles.main}>
      {currentGame ?
        selectGameComponent(currentGame)
        :
        <SpotifyView currentlyPlaying={previouslyPlayed} key={currentlyPlaying?.item.id} />
      }
    </main>
  </div>
}

function SpotifyView({ currentlyPlaying }: { currentlyPlaying: CurrentlyPlayingData | null }) {
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