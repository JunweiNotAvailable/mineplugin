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

/**
 * Replace the last pattern of searched string
 */
export const replaceLast = (str: string, search: string, replacement: string) => {
  const lastIndex = str.lastIndexOf(search);
  // If the search string is not found, return the original string
  if (lastIndex === -1) return str;
  // Replace the last occurrence
  const beforeLastIndex = str.substring(0, lastIndex);
  const afterLastIndex = str.substring(lastIndex + search.length);
  const replacedString = beforeLastIndex + replacement + afterLastIndex;

  return replacedString;
}

// Format date of given string
export const getFormattedDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
}