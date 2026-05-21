export function formatReadingTime(wordsCount) {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordsCount / wordsPerMinute);
  return `${minutes} min read`;
}
