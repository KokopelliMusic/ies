type CurrentlyPlayingData = {
  timestamp: number
  progress_ms: number
  is_playing: boolean
  item: {
    id: string
    name: string
    artists: SpotifyArtist[]
    album: SpotifyAlbum
  }
}

type SpotifyArtist = {
  name: string
}

type SpotifyAlbum = {
  artists: SpotifyArtist[]
  name: string
  images: {
    url: string
    height: number
    width: number
  }[]
}

type GameProps = {
  players: string[]
  time: number

  done: () => void
}