import { useEffect } from 'react'
import styles from '../styles/Spotify.module.sass'
import { getSpotifyLoginLink } from '../utils/spotify'
import dynamic from 'next/dynamic'

function LoginWithSpotify() {

  useEffect(() => {
    localStorage.clear()
  }, [])

  return <div className={styles.spotify}>
    <h1>Welkom bij <span>Kokopelli</span> / <span>IES</span></h1>

    <a className={styles.link} href={getSpotifyLoginLink()}>
      <h2>Login met spotify</h2>
    </a>
  </div>
}

export default dynamic(() => Promise.resolve(LoginWithSpotify), {
  ssr: true
})