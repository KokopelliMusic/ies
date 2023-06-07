

export function getRandomElement(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}