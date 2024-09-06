export function isAlphabetic(str: string): boolean {
  const alphabetRegex = /^[A-Za-z]+$/;
  return alphabetRegex.test(str);
}

export function isAlphabeticOrUnderscore(str: string): boolean {
  const alphabetUnderscoreRegex = /^[A-Za-z_]+$/;
  return alphabetUnderscoreRegex.test(str);
}

export function orderAlbhabetically(str: string): string {
  return str.split("").sort().join("");
}

/**
 * The entire alphabet
 */
export const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];