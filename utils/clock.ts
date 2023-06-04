// Function that converts time in seconds to a string in the format mm:ss
// If the time is more than 60 minutes it should be in the format hh:mm
export function formatTime(time: number): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor(time - hours * 3600 - minutes * 60);

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
}
