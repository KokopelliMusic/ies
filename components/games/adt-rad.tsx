import styles from '../../styles/games/adt-rad.module.sass'

export function AdtRad(props: GameProps) {
  return <div className={styles.main}>
    {props.players.map((player, i) => <h1 key={i}>
      {player}
    </h1>)}

    <button onClick={props.done}>
      Klaar
    </button>
  </div>
}