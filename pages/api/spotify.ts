// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

function getToken() {
  const apiServer = process.env.SPOTIFY_AUTH
  const clientId = process.env.SPOTIFY_CLIENT_ID

  if (!apiServer || !clientId) {
    throw new Error('No SPOTIFY_AUTH or SPOTIFY_CLIENT_ID env variable set')
  }


}

function getCurrentlyPlaying() {

}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' })
}
