import type { WordResult } from "@models/WordResult"

export interface WordleDictionarySearchParameters {
  charactersWithPositions: Array<Character>,
  charactersWithoutPositions: Array<Character>,
  charactersEliminated: Array<Character>
}

export interface SearchResponse {
  results: WordResult[],
  metadata: {
    count: number
  }
}