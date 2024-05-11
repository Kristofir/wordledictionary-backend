export function isAlphabetic(str: string): boolean {
  const alphabetRegex = /^[A-Za-z]+$/;
  return alphabetRegex.test(str);
}

export function isAlphabeticOrUnderscore(str: string): boolean {
  const alphabetUnderscoreRegex = /^[A-Za-z_]+$/;
  return alphabetUnderscoreRegex.test(str);
}