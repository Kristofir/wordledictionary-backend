import type { WordResult } from "@models/WordResult"

import {
  isAlphabetic,
  isAlphabeticOrUnderscore,
  alphabet
} from "run/helpers/alpha"

export interface IApplicationSearchParameters {
  charactersWithPositions: Array<Character>,
  charactersWithoutPositions: Array<Character>,
  charactersEliminated: Array<Character>,
  allFoundCharacters: Array<Character>,
  notFoundCharacters: Array<Character>
}

export class ApplicationSearchParameters implements IApplicationSearchParameters {
  charactersWithPositions: Array<Character>
  charactersWithoutPositions: Array<Character>
  charactersEliminated: Array<Character>
  /**
   * All characters found, with or without positions known
   */
  allFoundCharacters: Array<Character>
  /**
   * All characters not found but not eliminated; possibly still in play
   */
  notFoundCharacters: Array<Character>

  /**
   * Constructed from a URLSearchParams object
   */
  constructor(from: URLSearchParams) {
    const USP = from

    const foundQueryParam = USP.get('found')?.toLowerCase()
    const hasQueryParam = USP.get('has')?.toLowerCase() ?? null
    const notQueryParam = USP.get('not')?.toLowerCase() ?? null

    console.log(foundQueryParam)

    // Validate query parameters
    if (
      !foundQueryParam ||
      foundQueryParam.length !== 5 ||
      !isAlphabeticOrUnderscore(foundQueryParam)
    ) throw Error("Invalid parameter: found");
    if (
      (hasQueryParam && !isAlphabetic(hasQueryParam))
    ) throw Error("Invalid parameter: has");
    if (
      (notQueryParam && !isAlphabetic(notQueryParam))
    ) throw Error("Invalid parameter: not");

    // Create application search parameters
    this.charactersWithPositions = foundQueryParam.split(''),
    this.charactersWithoutPositions = hasQueryParam ? hasQueryParam.split('') : [],
    this.charactersEliminated = notQueryParam ? notQueryParam.split('') : []


    this.allFoundCharacters = Array.prototype.concat(
      this.charactersWithPositions,
      this.charactersWithoutPositions
    ).filter((c: Character) => isAlphabetic(c))

    this.notFoundCharacters = alphabet.filter((c: Character) => 
      !this.allFoundCharacters.includes(c) &&
      !this.charactersEliminated.includes(c)
    )
  }
}

export interface SearchResponse {
  results: WordResult[],
  metadata: {
    count: number
  }
}