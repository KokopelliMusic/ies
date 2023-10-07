import styles from '../../styles/games/text.module.sass'
import { Player } from '../store/player-store'

export function NoSocks(props: GameProps) {
  return <div className={styles.main}>
    <h1><span>Sokken check</span></h1>

    <h2>Iedereen die op dit moment <span className={styles.altspan}>geen</span> sokken aan heeft vouwt een <span>bak</span></h2>
  </div>
}