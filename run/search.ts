import type { WordleDictionarySearchParameters } from "models/Search";
import type { WordMetadata } from "models/WordMetadata";
import { 
  isAlphabetic, 
  isAlphabeticOrUnderscore 
} from "./helpers/alpha"

import { load } from "./load";

// Local types
type FilterFunction = (w:WordMetadata)=>boolean


export async function search(WDSP: WordleDictionarySearchParameters) {
  const words = await load()

  const filterFunctions = createFilterFunctions(WDSP)

  const unfilteredResults = words.answerWordMetadata
  const filteredResults = applyFilterFunctions(unfilteredResults, filterFunctions)

  console.log(filteredResults)
}


export function applyFilterFunctions(to: WordMetadata[], using: FilterFunction[]): WordMetadata[] {
  let wordList = to
  const filterFunctions = using

  for (const filterFunction of filterFunctions) {
    wordList = wordList.filter(filterFunction)
  }

  return wordList
}


export function createFilterFunctions(from: WordleDictionarySearchParameters): FilterFunction[] {
  const WDSP = from

  const filterFunctions: FilterFunction[] = []

  for (const character of WDSP.charactersEliminated) {
    filterFunctions.push(
      (w: WordMetadata) => { return !w.word.includes(character.toLowerCase()) }
    )
  }

  for (const character of WDSP.charactersWithoutPositions) {
    filterFunctions.push(
      (w: WordMetadata) => { return w.word.includes(character.toLowerCase()) }
    )
  }

  for (let positionIndex=0; positionIndex<5; positionIndex++) {
    const character = WDSP.charactersWithPositions[positionIndex];
    if (character !== '_') {
      filterFunctions.push(
        (w: WordMetadata) => { return (w.word.charAt(positionIndex) == character) }
      )
    }
  }

  return filterFunctions
}



export function createWordleDictionarySearchParameters(
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

