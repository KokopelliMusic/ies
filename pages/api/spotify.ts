// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentlyPlaying } from '../../utils/spotify'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentlyPlaying = await getCurrentlyPlaying()

  if (!currentlyPlaying) {
    res.status(204).end()
    return
  }

  res.status(200).json(currentlyPlaying)
}
