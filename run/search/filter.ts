import type { ApplicationSearchParameters } from "@models/Search";
import type { WordMetadata } from "@models/WordMetadata";
import { FilterFunction } from "./search";



export function applyFilterFunctions(to: WordMetadata[], using: FilterFunction[]): WordMetadata[] {
  let wordList = to;
  const filterFunctions = using;

  for (const filterFunction of filterFunctions) {
    wordList = wordList.filter((wm) => filterFunction(wm.word));
  }

  return wordList;
}


export function createFilterFunctions(from: ApplicationSearchParameters): FilterFunction[] {
  const WDSP = from;

  const filterFunctions: FilterFunction[] = [];

  for (const character of WDSP.charactersEliminated) {
    filterFunctions.push(
      (w: Word) => { return !w.includes(character.toLowerCase()); }
    );
  }

  for (const character of WDSP.charactersWithoutPositions) {
    filterFunctions.push(
      (w: Word) => { return w.includes(character.toLowerCase()); }
    );
  }

  for (let positionIndex = 0; positionIndex < 5; positionIndex++) {
    const character = WDSP.charactersWithPositions[positionIndex];
    if (character !== '_') {
      filterFunctions.push(
        (w: Word) => { return (w.charAt(positionIndex) == character); }
      );
    }
  }

  return filterFunctions;
}
