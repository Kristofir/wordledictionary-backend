import { WordResult } from "@models/WordResult";

export interface SearchResponseBody {
  data: {
    results: WordResult[]
  },
  metadata: {
    count: number
  }
}

export interface SearchResponseBodyV2 {
  data: {
    results: SearchResults,
  },
  metadata: {
    maxPossibleAnswerScore: number,
    counts: {
      remainingPossibleAnswers: number,
      eliminatedPossibleAnswers: number,
      nonanswers: number
    },
    characterSetCounts: {
      characters: Record<Character, number>,
      U2CSets: Record<U2CSet, number>,
      U3CSets: Record<U2CSet, number>,
    },
    serverResponseTime: number
  }
}

export interface SearchResults {
  remainingPossibleAnswers: WordResult[],
  eliminatedPossibleAnswers: {
    highPotential: WordResult[],
    lowPotential: WordResult[]
  },
  nonanswers: {
    highPotential: WordResult[],
    lowPotential: WordResult[]
  }
}

export type ResponseBody = SearchResponseBody | SearchResponseBodyV2