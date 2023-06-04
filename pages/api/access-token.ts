// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { requestAccessToken } from '../../utils/spotify'

type ReqData = {
  code: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body as ReqData

  try {
    await requestAccessToken(data.code)
  } catch (e) {
    console.error(e)
    res.status(500).send(e.message)
    return
  }

  res.status(202).send('ok')
}
