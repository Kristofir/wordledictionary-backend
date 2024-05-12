import type { WordleDictionarySearchParameters } from "models/Search";
import type { WordMetadata } from "models/WordMetadata";
import { 
  isAlphabetic, 
  isAlphabeticOrUnderscore 
} from "../helpers/alpha"

import { load } from "../load";
import { createFilterFunctions, applyFilterFunctions } from "./filter";

// Local types
export type FilterFunction = (w:WordMetadata)=>boolean

/**
 * Search function sequence
 * @param USP 
 */
export async function search(USP: URLSearchParams) {

  // Create filters from search parameters
  const applicationSearchParameters = createApplicationSearchParameters(USP)
  const filterFunctions = createFilterFunctions(applicationSearchParameters)

  // Load word lists
  const words = await load()

  const allAnswerWordMetadata = words.answerWordMetadata
  const allNonanswerWordMetadata = words.nonanswerWordMetadata
  
  const filteredAnswerWordMetadata = applyFilterFunctions(allAnswerWordMetadata, filterFunctions)

  console.log(filteredAnswerWordMetadata)
}


export function createApplicationSearchParameters(
  USP: URLSearchParams
): WordleDictionarySearchParameters {

  // Pull query params out of URLSearchParams object
  const foundQueryParam = USP.get('found')?.toLowerCase()
  const hasQueryParam = USP.get('has')?.toLowerCase() ?? null
  const notQueryParam = USP.get('not')?.toLowerCase() ?? null

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
  const WDSP: WordleDictionarySearchParameters = {
    charactersWithPositions: foundQueryParam.split(''),
    charactersWithoutPositions: hasQueryParam ? hasQueryParam.split('') : [],
    charactersEliminated: notQueryParam ? notQueryParam.split('') : []
  }

  console.log(WDSP)

  return WDSP
}

