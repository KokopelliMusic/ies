import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from '../styles/Game.module.sass'
import { formatTime } from '../utils/clock'
import Image from 'next/image'
// import Background from '../public/background.svg'
import Background from '../components/background'
import { AdtRad } from '../components/games/adt-rad'
import dynamic from 'next/dynamic'
import { DuctTapeAlarm } from '../components/games/duct-tape-alarm'
import { useDispatch, useSelector } from 'react-redux'
import { addPlayer, editPlayerName, selectPlayerState } from '../store/PlayerSlice'
import { removePlayer } from '../store/PlayerSlice'
import { DrinkingBuddies } from '../components/games/drinking-buddies'
import { LastToLeave } from '../components/games/last-to-leave'
import { SayNoEvil } from '../components/games/say-no-evil'
import { SnakeEyes } from '../components/games/snake-eyes'
import { Bussen } from '../components/games/bussen'
import { DeepFryFrenzy } from '../components/games/deep-fry-frenzy'
import { NoSocks } from '../components/games/no-socks'
import { ClothingCheck } from '../components/games/clothing-check'
import { BeerMile } from '../components/games/beer-mile'
import { StressPong } from '../components/games/stress-pong'
import { BeerRelay } from '../components/games/beer-relay'
import { GameTypes, gameTypeToname, getAmountOfGames } from '../types/game'
import { changeGame, selectEnabledGamesState } from '../store/EnabledGamesSlice'
import { Barman } from '../components/games/barman'
import { Stoelendans } from '../components/games/stoelendans'

const REFRESH_INTERVAL = 5 // seconds
const GAME_CHECK_INTERVAL = 60 // seconds
// This is the minimum amount of checks that have to have passed before a game can start
const MIN_GAME_INTERVAL = 3
const DEFAULT_GAME_CHANCE = 0.2



function GameView() {
  const enabledGames = useSelector(selectEnabledGamesState)

  const [time, setTime] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [hideBg, setHideBg] = useState<boolean>(true)

  const dialogRef = React.useRef<HTMLDialogElement>(null)

  const [songSlide, setSongSlide] = useState<boolean>(false)

  // Game logic
  const [currentGame, setCurrentGame] = useState<GameTypes | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlayingData | null>(null)
  const [previouslyPlayed, setPreviouslyPlayed] = useState<CurrentlyPlayingData | null>(null)
  const [timeSinceLastGame, setTimeSinceLastGame] = useState<number>(0)
  const [gameChance, setGameChance] = useState<number>(DEFAULT_GAME_CHANCE)

  // Setup app
  useEffect(() => {
    const time = localStorage.getItem('time')
    if (time) setTime(parseInt(time))


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
        const game = enabledGames[Math.floor(Math.random() * enabledGames.length / 2)]
        console.log('Game time! We are going to play: ' + gameTypeToname(game))
        setCurrentGame(game)
      }
    }
  }, [time])

  // A new game starts!
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

  function selectGameComponent(game: GameTypes) {
    switch (game) {
      case GameTypes.AdtRad:
        return <AdtRad time={time} done={gameDone} />
      case GameTypes.DuctTapeAlarm:
        return <DuctTapeAlarm time={time} done={gameDone} />
      case GameTypes.DrinkingBuddies:
        return <DrinkingBuddies time={time} done={gameDone} />
      case GameTypes.LastToLeave:
        return <LastToLeave time={time} done={gameDone} />
      case GameTypes.SayNoEvil:
        return <SayNoEvil time={time} done={gameDone} />
      case GameTypes.SnakeEyes:
        return <SnakeEyes time={time} done={gameDone} />
      case GameTypes.Bussen:
        return <Bussen time={time} done={gameDone} />
      case GameTypes.DeepFryFrenzy:
        return <DeepFryFrenzy time={time} done={gameDone} />
      case GameTypes.NoSocks:
        return <NoSocks time={time} done={gameDone} />
      case GameTypes.ClothingCheck:
        return <ClothingCheck time={time} done={gameDone} />
      case GameTypes.BeerMile:
        return <BeerMile time={time} done={gameDone} />
      case GameTypes.StressPong:
        return <StressPong time={time} done={gameDone} />
      case GameTypes.BeerRelay:
        return <BeerRelay time={time} done={gameDone} />
      case GameTypes.Barman:
        return <Barman time={time} done={gameDone} />
      case GameTypes.Stoelendans:
        return <Stoelendans time={time} done={gameDone} />

      default:
        return <div>Onbekend spel</div>
    }
  }

  function gameDone() {
    setCurrentGame(null)
    setTimeSinceLastGame(0)
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
    <Dialog dialogRef={dialogRef} />

    <div className={`${styles.notification} ${styles.bg}`} hidden={hideBg}>
      <Background fgColor='red' />
    </div>

    <div className={styles.bg}>
      <Background />
    </div>

    <div className={styles.header}>
      <div className={styles.clock}>
        <button className={styles.editButton} onClick={() => dialogRef.current?.showModal()}>Instellingen</button>
      </div>

      {currentGame !== null ?
        <h1 className={styles.fadeIn + ' ' + styles.title}>
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

    <main className={`${styles.main} ${styles.fadeIn}`} key={currentGame !== null ? -1 : currentGame}>
      {currentGame !== null ?
        selectGameComponent(currentGame)
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
  const players = useSelector(selectPlayerState)
  const enabledGames = useSelector(selectEnabledGamesState)
  const dispatch = useDispatch()

  return <dialog ref={dialogRef} className={styles.dialog}>
    <h1>Bewerk spelers</h1>
    <div className={styles.dialogTable}>
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
    </div>

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