import { ApplicationSearchParameters } from "@models/Search"

export function hasOverlap(
  word: Word, 
  asp: ApplicationSearchParameters
): boolean {

  for (let i = 0; i < asp.charactersWithPositions.length; i++) {
    if (
      asp.charactersWithPositions[i] !== '_' &&
      word[i] !== asp.charactersWithPositions[i]
    ) { return false }
  }

  for (let characterWithoutPositions of asp.charactersWithoutPositions) {
    if (!word.includes(characterWithoutPositions)) { return false }
  }

  for (let characterEliminated of asp.charactersEliminated) {
    if (word.includes(characterEliminated)) { return false }
  }

  return true
}