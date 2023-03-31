export function areValuesEqual(value: string, searchValue: string): boolean {
  const prepareValue = (value: string): string => value.toLowerCase().replace(' ', '');
  return prepareValue(value).includes(prepareValue(searchValue));
}
