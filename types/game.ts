export enum GameTypes {
  AdtRad,
  DuctTapeAlarm,
  DrinkingBuddies,
  LastToLeave,
  SayNoEvil,
  SnakeEyes,
  Bussen,
  DeepFryFrenzy,
  NoSocks,
  ClothingCheck,
  BeerMile,
  StressPong,
  BeerRelay,
  Barman,
  Stoelendans,
}

export function gameTypeToname(type: GameTypes) {
  switch (type) {
    case GameTypes.AdtRad:
      return 'Adt rad!'
    case GameTypes.DuctTapeAlarm:
      return 'Duct tape alarm!'
    case GameTypes.DrinkingBuddies:
      return 'Drinking buddies!'
    case GameTypes.LastToLeave:
      return 'NL-Alert'
    case GameTypes.SayNoEvil:
      return 'Say no evil!'
    case GameTypes.SnakeEyes:
      return 'Snake eyes!'
    case GameTypes.Bussen:
      return 'Bussen!'
    case GameTypes.DeepFryFrenzy:
      return 'Lekker, Frituur!'
    case GameTypes.NoSocks:
      return 'Sokkencheck!'
    case GameTypes.ClothingCheck:
      return 'Kledingcheck!'
    case GameTypes.BeerMile:
      return 'Beer mile!'
    case GameTypes.StressPong:
      return 'Stress pong!'
    case GameTypes.BeerRelay:
      return 'Bierestafette!'
    case GameTypes.Barman:
      return 'Barman!'
    case GameTypes.Stoelendans:
      return 'Stoelendans!'

    default:
      return 'Onbekend spel'
  }
}

export function getAmountOfGames() {
  return (Object.keys(GameTypes).length / 2)
}

export function getDisabledGames(enabledGames: number[]) {
  // Get all numbers from 0 to the length of the GameTypes enum
  // THat are not in the enabledGames array
  return Array.from(Array(Object.keys(GameTypes).length / 2).keys()).filter((_, id) => !enabledGames.includes(id))
}