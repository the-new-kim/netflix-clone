export function makeImagePath(path: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${path}`;
}

export function toHoursAndMinutes(totalMinutes: number) {
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  const hours = Math.floor(totalMinutes / 60).toString();

  return `${hours}:${minutes}`;
}

export function makeTrailerPath(key: string) {
  return `https://www.youtube.com/embed/${key}?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0&autoplay=1&mute=1`;
}
