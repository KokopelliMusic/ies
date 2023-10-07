import { useEffect, useState } from 'react'
import styles from '../styles/Spotify.module.sass'
import { requestAccessToken } from '../utils/spotify'

export default function SpotifyCallback() {

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const code = new URLSearchParams(window.location.search).get('code')

      if (!code) {
        setError('Geen code gevonden in de URL.')
        return
      }

      const res = await fetch('/api/access-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })

      if (!res.ok) {
        setError('Er is iets fout gegaan bij het ophalen van de access token.')
        return
      }

      // Redirect
      window.location.href = '/setup'
    })()
  }, [])

  return <div className={styles.spotify}>
    {error ?
      <div>
        <h1>Er is iets fout gegaan...</h1>
        <p>{error}</p>
      </div>
      :
      <h1>Begin met inloggen...</h1>
    }
  </div>
}