import { config } from "./Config";

// Generate random string with given length
export const getRandomString = (length: number): string => {
  return Array.from({ length: length }, () =>
    Math.random().toString(36).charAt(2)
  ).join('');
}

// Return the java class name format of input string
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

// Replace the last pattern of searched string
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

/**
 * Handle images
 */

// Get the extension from filename
export const getExtension = (filename: string) => {
  const extensionIndex = filename.lastIndexOf('.');
  if (extensionIndex === -1) return '';
  return filename.substring(extensionIndex);
}

// Upload image to s3
export const uploadImage = async (dir: string, imageFile: File | null) => {
  if (imageFile === null) return { imageName: '', urlRes: '' };
  const reader = new FileReader();
  const uploadPromise = new Promise<{ imageName: string; urlRes: string }>((resolve, reject) => {
    reader.onload = async function () {
      const imageBase64 = reader.result?.toString()?.split(',')[1];
      const imageName = getRandomString(16) + getExtension(imageFile.name);
      const url = reader.result as string;
      await fetch(`${config.api.s3}/access-image`, {
        method: 'POST',
        body: JSON.stringify({
          bucketName: 'mineplugin-bucket',
          name: `${dir}/${imageName}`,
          image: imageBase64,
        })
      });
      resolve({ imageName: imageName, urlRes: url });
    };
    reader.onerror = (error) => reject(error);
  });
  reader.readAsDataURL(imageFile);
  return await uploadPromise;
};

// Get image from s3
export const getImageUrl = async (filepath: string) => {
  if (!filepath) return '';
  try {
    const response = await fetch(`${config.api.s3}/access-image?bucketName=mineplugin-bucket&fileName=${filepath}`, { headers: { 'Content-Type': 'application/json' } });
    const data = await response.text();
    return 'data:image/jpeg;base64,' + data;
  } catch (error) {
    console.log(error)
    return '';
  }
}

// Delete image from s3
export const deleteImage = async (filepath: string) => {
  await fetch(`${config.api.s3}/access-image?bucketName=mineplugin-bucket&fileName=${filepath}`, { method: 'DELETE' });
}
