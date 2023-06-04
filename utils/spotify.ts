import fs from 'fs'

let accessToken: string
let refreshToken: string
let expiresAt: Date

export async function getCurrentlyPlaying() {
  const token = await getAccessToken()

  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (res.status === 204) {
    return null
  }

  const data = await res.json()

  return data
}

export async function getAccessToken(): Promise<string> {


  // If we have a token and it's not expired, return it
  if (accessToken && expiresAt && expiresAt > new Date()) {
    return accessToken
  }

  // then, check if we have a token saved to disk
  const tokenFromDisk = readTokenFromDisk()

  if (tokenFromDisk && tokenFromDisk.expiresAt > new Date()) {
    accessToken = tokenFromDisk.token
    expiresAt = tokenFromDisk.expiresAt
    refreshToken = tokenFromDisk.refreshToken
    return accessToken
  }

  // Otherwise, we have to refresh the token 

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing client id or secret')
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`
  })

  const data = await res.json()

  console.log({ refreshToken, data })

  accessToken = data.access_token
  expiresAt = new Date(Date.now() + (data.expires_in - 300) * 1000)

  saveTokenToDisk(accessToken, expiresAt, refreshToken)

  return accessToken
}

export function getSpotifyLoginLink(): string {
  return `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=user-read-playback-state,user-modify-playback-state,user-read-currently-playing`
}

export async function requestAccessToken(code: string) {
  return await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}`
  })
    .then(res => res.json())
    .then(res => {
      accessToken = res.access_token
      expiresAt = new Date(Date.now() + (res.expires_in - 300) * 1000)
      refreshToken = res.refresh_token

      saveTokenToDisk(accessToken, expiresAt, refreshToken)

      return res
    })
}

function saveTokenToDisk(token: string, expiresAt: Date, refreshToken: string) {
  console.log({ token, expiresAt, refreshToken })

  if (!token || !expiresAt || !refreshToken) {
    return
  }

  const stream = fs.createWriteStream('./token.txt')
  stream.write(token + '\n')
  stream.write(expiresAt.toString() + '\n')
  stream.write(refreshToken + '\n')
  stream.end()
}

function readTokenFromDisk(): { token: string, expiresAt: Date, refreshToken: string } | null {
  if (!fs.existsSync('./token.txt')) {
    return null
  }

  const file = fs.readFileSync('./token.txt', 'utf-8')
  const [token, expiresAt, refreshToken] = file.split('\n')
  return { token, expiresAt: new Date(expiresAt), refreshToken }
}