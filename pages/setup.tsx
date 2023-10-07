import { useState } from 'react'
import styles from '../styles/Setup.module.sass'
import { GameTypes, gameTypeToname } from '../types/game'
import { Players } from '../store/player-store'
import { useAtom } from 'jotai'
import { CurrentSelectedGames } from '../store/game-store'

export default function Home() {
  const [playerInput, setPlayerInput] = useState<string[]>([])
  const [step, setStep] = useState<number>(0)
  const [players, setPlayers] = useAtom(Players)
  const [games, setGames] = useAtom(CurrentSelectedGames)

  const toggleGame = (id: string) => {
    setGames(games.map(g => {
      if (g.id === id) {
        g.active = !g.active
        return g
      }
      return g
    }))
  }

  const finish = () => {
    // Save players and selected games
    setPlayers(playerInput.map((name, id) => {
      return {
        name,
        id,
        active: true
      }
    }))


    // Redirect to game
  }

  return <div className={styles.container}>
    {step === 0 ?
      <>
        <h1>Wie doen er mee?</h1>
        <p>Vul hieronder de namen van alle spelers in, comma-gesepereerd</p>
        <textarea onChange={(e) => {
          setPlayerInput(e.target.value.split(','))
        }} />

        <div className="center"><button style={{ marginTop: '1rem' }} onClick={() => setStep(1)}>Doorgaan</button></div>

        <p>Huidige spelers:</p>
        {playerInput.map(player => <div>{player}</div>)}
      </> :
      <>
        <h1>Welke spellen willen jullie spelen?</h1>
        <p>Dit is ten alle tijden aan te passen gedurende het spel</p>

        <button style={{ marginBottom: '1rem' }} onClick={finish}>Start het spel!</button>

        <div className={styles.center}>
          <table>
            <thead>
              <tr>
                <th>Spel</th>
                <th>Ingeschakeld</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(Array(Object.keys(GameTypes).length / 2).keys()).map((game, idx) => <tr key={idx}>
                <td><label htmlFor={'game-' + game}>{gameTypeToname(game)}</label></td>
                <td><input id={'game-' + game} type="checkbox" defaultChecked={true} checked={gameInput[game]} onChange={e => toggleGame(game)} /></td>
              </tr>)}
            </tbody>
          </table>
        </div>

      </>
    }

  </div >
}
