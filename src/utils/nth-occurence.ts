export const nthOccurrence = (string: string, char: string, nth: number): number => {
  const firstIndex = string.indexOf(char);
  const lengthUpToFirstIndex = firstIndex + 1;

  if (nth === 1) {
    return firstIndex;
  } else {
    const stringAfterFirstOccurrence = string.slice(lengthUpToFirstIndex);
    const nextOccurrence = nthOccurrence(stringAfterFirstOccurrence, char, nth - 1);

    if (nextOccurrence === -1) {
      return -1;
    } else {
      return lengthUpToFirstIndex + nextOccurrence;
    }
  }
};
