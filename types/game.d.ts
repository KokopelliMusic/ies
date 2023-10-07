type Player = {
  name: string
  id: number
  active: boolean
}

type GameProps = {
  time: number
  done: () => void
  players: Player[]
}