import type { 
  WordleDictionarySearchParameters
} from "models/Search"

import { describe, test, expect, it } from "bun:test"

import {
  createFilterFunctions,
  applyFilterFunctions
} from "./filter"

import {
  UKCCTable
} from "run/search/UKCCTable"

import {
  load
} from "../load"


describe("Search", async () => {
  const applicationTestSearchParameters: WordleDictionarySearchParameters = {
    charactersWithPositions: ["a", "_", "_", "s", "e"],
    charactersWithoutPositions: ["i", "r"],
    charactersEliminated: ["z", "o"]
  }

  const filterFunctions = createFilterFunctions(applicationTestSearchParameters)

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

  const testTable = new UKCCTable()


  test("Create filter functions", () => {
    expect(filterFunctions).toBeArray()
    filterFunctions.forEach((f: Function) => {
      expect(f).toBeFunction()
    })
  })

  test("Filter by filter functions", async () => {
    // It should return only one result: the expectedSoleResult in an array of length 1
    expect(filteredResults).toBeArrayOfSize(1)
    expect(filteredResults[0]).toMatchObject(expectedSoleResult)
  })

  test("Populate UKCC table", () => {
    testTable.registerWord(expectedSoleResult)
    expect(testTable.U2CCs).toContainKey("ar")
    expect(testTable.U2CCs["ar"]).toEqual(1)

    testTable.registerWord(expectedSoleResult) // Now counts should double
    expect(testTable.U2CCs["ar"]).toEqual(2)
  })

})