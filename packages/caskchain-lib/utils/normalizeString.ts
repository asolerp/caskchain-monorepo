import exp from "constants";

// Function to normalize a string
export const normalizeString = (str: string): string => {
  if (!str) {
    return "";
  }

  // Remove leading and trailing white spaces
  let normalizedStr = str.trim();

  // Convert to lowercase
  normalizedStr = normalizedStr.toLowerCase();

  // Replace multiple spaces with a single space
  normalizedStr = normalizedStr.replace(/\s+/g, " ");

  // Remove special characters
  normalizedStr = normalizedStr.replace(/[^a-zA-Z0-9 ]/g, "");

  return normalizedStr;
};
