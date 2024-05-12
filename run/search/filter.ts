import type { WordleDictionarySearchParameters } from "models/Search";
import type { WordMetadata } from "models/WordMetadata";
import { FilterFunction } from "./search";



export function applyFilterFunctions(to: WordMetadata[], using: FilterFunction[]): WordMetadata[] {
  let wordList = to;
  const filterFunctions = using;

  for (const filterFunction of filterFunctions) {
    wordList = wordList.filter(filterFunction);
  }

  return wordList;
}


export function createFilterFunctions(from: WordleDictionarySearchParameters): FilterFunction[] {
  const WDSP = from;

  const filterFunctions: FilterFunction[] = [];

  for (const character of WDSP.charactersEliminated) {
    filterFunctions.push(
      (w: WordMetadata) => { return !w.word.includes(character.toLowerCase()); }
    );
  }

  for (const character of WDSP.charactersWithoutPositions) {
    filterFunctions.push(
      (w: WordMetadata) => { return w.word.includes(character.toLowerCase()); }
    );
  }

  for (let positionIndex = 0; positionIndex < 5; positionIndex++) {
    const character = WDSP.charactersWithPositions[positionIndex];
    if (character !== '_') {
      filterFunctions.push(
        (w: WordMetadata) => { return (w.word.charAt(positionIndex) == character); }
      );
    }
  }

  return filterFunctions;
}
