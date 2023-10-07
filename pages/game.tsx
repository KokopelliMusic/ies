import React, { useEffect, useState } from 'react'
import styles from '../styles/Game.module.sass'
import { formatTime } from '../utils/clock'
import Background from '../components/background'
import dynamic from 'next/dynamic'
import { useAtom } from 'jotai'
import { CurrentSelectedGames } from '../store/game-store'
import { Game, GameProps, Player } from '../types/game'
import { FormattedTime, Time } from '../store/time-store'
import { current } from '@reduxjs/toolkit'
import { getGameComponent } from '../games/games'
import { PlayerRanking, Players } from '../store/player-store'

// How often spotify data is polled
const REFRESH_INTERVAL = 10 // seconds
// How often we cycle through the game loop

// Every x seconds we either play a game, or increase the chance that a game happens
// const GAME_CHECK_INTERVAL = 60 // seconds
const GAME_CHECK_INTERVAL = 10 // seconds

// This is the minimum amount of cycles that have to have passed before a game can start
const MIN_GAME_INTERVAL = 1

// Default chance of a game happening, at 20%
// This is increased on every failed attempt to start a game with 10%
// After a game this is reset to 20%
// const DEFAULT_GAME_CHANCE = 0.2
const DEFAULT_GAME_CHANCE = 1


// How long games last on screen
const GAME_DURATION = 10


function GameView() {
  const [selectedGames] = useAtom(CurrentSelectedGames)
  const [players, setPlayers] = useAtom(Players)
  const [playerRanking] = useAtom(PlayerRanking)

  const [time, setTime] = useAtom(Time)
  const [formattedTime] = useAtom(FormattedTime)
  const [loading, setLoading] = useState<boolean>(true)
  const [hideBg, setHideBg] = useState<boolean>(true)

  const dialogRef = React.useRef<HTMLDialogElement>(null)

  const [songSlide, setSongSlide] = useState<boolean>(false)

  // Game logic
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingData | null>(null)
  const [previouslyPlayed, setPreviouslyPlayed] = useState<CurrentlyPlayingData | null>(null)
  const [timeSinceLastGame, setTimeSinceLastGame] = useState<number>(0)
  const [timeSinceGameBegin, setTimeSinceGameBegin] = useState<number>(0)
  const [gameChance, setGameChance] = useState<number>(DEFAULT_GAME_CHANCE)

  // Setup the ticker
  useEffect(() => {
    const interval = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch currently playing
  useEffect(() => {
    refreshSpotify()
      .then(() => setTimeout(() => setLoading(false), 500))
  }, [])

  // Main game loop, runs every tick
  useEffect(() => {
    if (time === 0) return

    if (time % REFRESH_INTERVAL === 0) {
      refreshSpotify()
    }

    if (time % GAME_CHECK_INTERVAL === 0) {
      if (currentGame !== null) {
        if (timeSinceGameBegin > GAME_DURATION) {
          gameDone()
          return
        }

        setTimeSinceGameBegin(t => t + 1)
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

        // Select a game that can support the playerbase
        const possibleGames = selectedGames.filter(game => players.length >= game.players.minimum)
        const game = possibleGames[Math.floor(Math.random() * possibleGames.length)]

        console.log('Game time! We are going to play: ' + game.name)
        console.log(game)
        selectPlayers(game)
        setCurrentGame(game)
      }
    }
  }, [time])

  // When the ticker decides that a new game is starting
  // start that game
  useEffect(() => {
    if (currentGame === null) {
      setTimeSinceLastGame(0)
      return
    }


    for (let i = 0; i < 4000; i += 1000) {
      setTimeout(() => setHideBg(false), i)
      setTimeout(() => setHideBg(true), i + 500)
    }
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
        if (!data || !data.item) return
        if (currentlyPlaying?.item.id !== data.item.id) {
          setSongSlide(true)
          setTimeout(() => setSongSlide(false), 5000)
        }

        setPreviouslyPlayed(currentlyPlaying ?? data)
        setTimeout(() => setPreviouslyPlayed(data), 2500)
        setCurrentlyPlaying(data)
      })
  }

  function gameDone() {
    setCurrentGame(null)
    setTimeSinceLastGame(0)
    setTimeSinceGameBegin(0)
  }

  function selectPlayers(game: Game) {
    // Select the player which has been selected the least amount of times
    // Also update the timesSelected property on a Player

    let selection: Player[] = []

    if (game.players.maximum > players.length) {
      // Select the first x players
      selection = playerRanking.splice(0, game.players.maximum)
    } else {
      selection = playerRanking
    }

    // Update the ranking
    setPlayers(ps => {
      for (const playerSelected of selection) {
        let p = ps.find(playerObject => playerObject.id === playerSelected.id)
        if (p) {
          p.timesSelected++
          console.log('Player ' + p.name + ' is de lul')
        }
      }

      return ps
    })
  }

  if (loading) return <div className={styles.game}>
    <div className={styles.bg}>
      <Background />
    </div>

    <div className={styles.loading}>
      <h1>Kokopelli</h1>
      <h2>Laden...</h2>
    </div>
  </div>

  return <div className={styles.game}>
    <Dialog dialogRef={dialogRef} />

    <div className={`${styles.notification} ${styles.bg}`} hidden={hideBg}>
      <Background fgColor='red' />
    </div>

    <div className={styles.bg}>
      <Background />
    </div>

    <div className={styles.header}>
      <div className={styles.clock}>
        <button className={styles.editButton} onClick={() => dialogRef.current?.showModal()}>⚙️</button>
      </div>

      {currentGame !== null ?
        <h1 className={styles.fadeIn + ' ' + styles.title}>
          {currentGame.name}
        </h1>
        :
        <h1 className={styles.fadeIn}>
          Kokopelli
        </h1>
      }

      <p className={styles.clock}>
        {formattedTime}
      </p>
    </div>

    <main className={`${styles.main} ${styles.fadeIn}`} key={currentGame !== null ? -1 : currentGame}>
      {currentGame ?
        getGameComponent(currentGame, selectedPlayers)
        :
        <div className={`${songSlide ? styles.slide : ''} ${styles.spotifyContainer}`}>
          <SpotifyView currentlyPlaying={previouslyPlayed} key={currentlyPlaying?.item?.id ?? 'id'} />
        </div>
      }
    </main>
  </div>
}

function Dialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement> }) {
  // Redux
  // const players = useSelector(selectPlayerState)
  // const enabledGames = useSelector(selectEnabledGamesState)
  // const dispatch = useDispatch()

  return <dialog ref={dialogRef} className={styles.dialog}>
    <h1>Bewerk spelers</h1>
    {/* <div className={styles.dialogTable}>
      <div>
        <p>Voer hieronder de spelers in.</p>
        {players.map((player, idx) => <div key={idx}>
          <input type="text" defaultValue={player} onChange={e => dispatch(editPlayerName({ id: idx, name: e.target.value }))} />
          <button onClick={() => dispatch(removePlayer(idx))}>x</button>
        </div>)}
        <button onClick={() => dispatch(addPlayer(""))}>+</button>
      </div>

      <div className={styles.dialogEnabledGames}>
        <p>Welke spelletjes kunnen voorkomen?</p>
        {Array.from(Array(Object.keys(GameTypes).length / 2).keys()).map((game, idx) => <div key={idx}>
          <input type="checkbox" defaultChecked={true} onChange={e => dispatch(changeGame(game))} />
          <label>{gameTypeToname(game)}</label>
        </div>)}
      </div>
    </div> */}

    <br />
    <br />

    <div className={styles.buttonGroup}>
      <button onClick={() => dialogRef.current?.close()}>Sluiten</button>
      <button onClick={() => dialogRef.current?.close()}>Opslaan</button>
    </div>

  </dialog>
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

export default dynamic(() => Promise.resolve(GameView), { ssr: false })