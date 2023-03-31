export const checkIsEmpty = (value: string): string => {
  if (value === '') {
    return 'No folder found';
  }
  return value;
};

export const labelFromKey = (value: string): string => {
  const editing = value.charAt(0).toUpperCase() + value.slice(1);

  return editing.split(/(?=[A-Z])/).join(' ');
};
