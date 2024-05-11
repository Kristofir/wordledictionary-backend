import type { 
  WordleDictionarySearchParameters
} from "models/Search"

import { describe, test, expect, it } from "bun:test"

import {
  createFilterFunctions,
  applyFilterFunctions
} from "./search"

import {
  load
} from "./load"

const applicationTestSearchParameters: WordleDictionarySearchParameters = {
  charactersWithPositions: ["a", "_", "_", "s", "e"],
  charactersWithoutPositions: ["i", "r"],
  charactersEliminated: ["z", "o"]
}

describe("Filtering", () => {
  const filterFunctions = createFilterFunctions(applicationTestSearchParameters)

  test("Create filter functions", () => {
    expect(filterFunctions).toBeArray()
    filterFunctions.forEach((f: Function) => {
      expect(f).toBeFunction()
    })
  })

  test("Filter by filter functions", async () => {
    const wordList = await load()
    const unfilteredResults = wordList.answerWordMetadata

    const expectedSoleResult = {
      word: "arise",
      possibleAnswer: true,
      U2CCs: ["ar", "ai", "as", "ae", "ir", "rs", "er", "is", "ei", "es"],
      U3CCs: ["air", "ars", "aer", "ais", "aei", "aes", "irs", "eir", "ers", "eis"],
      U4CCs: ["airs", "aeir", "aers", "aeis", "eirs"],
      U5CC: "aeirs",
    }

    const filteredResults = applyFilterFunctions(unfilteredResults, filterFunctions)

    // It should return only one result: the expectedSoleResult in an array of length 1
    expect(filteredResults).toBeArrayOfSize(1)
    expect(filteredResults[0]).toMatchObject(expectedSoleResult)
  })

})