import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GameView } from './game'

export default function Home() {
  return (
    <div className={styles.container}>
      <GameView />
    </div>
  )
}
