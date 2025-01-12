export function IdConversion(id: string): string {
  const idConverted = id
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return idConverted;
}
