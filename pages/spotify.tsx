import styles from '../styles/Spotify.module.sass'
import { getSpotifyLoginLink } from '../utils/spotify'

function LoginWithSpotify() {

  return <div className={styles.spotify}>
    <h1>Invictus Entertainment Systeem</h1>

    <a className={styles.link} href={getSpotifyLoginLink()}>
      <h2>Login</h2>
    </a>
  </div>
}

export default LoginWithSpotify