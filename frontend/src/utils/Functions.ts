/**
 * Return the java class name format of input string
 */
export const toClassFormat = (str: string) => {
  // Remove invalid characters
  const validChars = str.replace(/[^a-zA-Z0-9_]+/g, '');
  // Return random plugin number if empty
  if (validChars.length === 0) return `Plugin${Math.random().toString(36).slice(2, 5)}`;
  const formatted = /^[a-zA-Z]/.test(validChars.charAt(0)) ? validChars : 'Plugin' + validChars;
  // Capitalize the first letter
  const classFormatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

  return classFormatted;
}