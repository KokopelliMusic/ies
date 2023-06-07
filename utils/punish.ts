
const punishments = [
  'neem je 2 slokken',
  'neem je 4 slokken',
  'doe je een shotje',
  'neem je 6 slokken',
  'neem je 8 slokken',
  'trek je een bak',
]

const punishments2 = [
  'neemt diegene 2 slokken',
  'neemt diegene 4 slokken',
  'doet diegene een shotje',
  'neemt diegene 6 slokken',
  'neemt diegene 8 slokken',
  'trekt diegene een bak',
]

export function getRandomPunishment(): string {
  return selectRandomElement(punishments);
}

export function getRandomPunishmentSecondPerson(): string {
  return selectRandomElement(punishments2);
}


// ChatGPT wrote this
function selectRandomElement<T>(arr: T[]): T {
  const totalWeight = arr.length * (arr.length + 1) / 2; // Calculate the total weight based on the indices

  const randomWeight = Math.floor(Math.random() * totalWeight) + 1; // Generate a random weight within the total weight range

  let cumulativeWeight = 0;
  for (let i = 0; i < arr.length; i++) {
    cumulativeWeight += i + 1; // Increment the cumulative weight
    if (cumulativeWeight >= randomWeight) {
      return arr[i];
    }
  }

  // If the loop completes without returning, return the last element as a fallback
  return arr[arr.length - 1];
}