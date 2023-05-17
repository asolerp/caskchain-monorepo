export const upperCaseFirstLetter = (wordToUpperCase: string) => {
  return wordToUpperCase
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
