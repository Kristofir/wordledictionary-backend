import type { 
  IApplicationSearchParameters
} from "models/Search"
import type { WordMetadata } from "@models/WordMetadata"



import { describe, test, expect, it } from "bun:test"

import {
  defineArrayIntersectOverride
} from "run/helpers/array"

import {
  load
} from "../load"

import { ApplicationSearchParameters } from "models/Search"

import {
  createFilterFunctions,
  applyFilterFunctions
} from "./filter"

import {
  UKCCTable
} from "run/search/UKCCTable"

import {
  scoreWordList
} from "./score"

import {
  search
} from "./search"


defineArrayIntersectOverride()

describe("Search", async () => {
  const testURLSearchParams = createTestURLSearchParams()
  const applicationTestSearchParameters = new ApplicationSearchParameters(testURLSearchParams)

  const filterFunctions = createFilterFunctions(applicationTestSearchParameters)

  const wordList = await load()
  const unfilteredResults = wordList.answerWordMetadata

  // We can expect this result.
  const anExpectedResult = {
    word: "arise",
    possibleAnswer: true,
    U2CCs: ["ar", "ai", "as", "ae", "ir", "rs", "er", "is", "ei", "es"],
    U3CCs: ["air", "ars", "aer", "ais", "aei", "aes", "irs", "eir", "ers", "eis"],
    U4CCs: ["airs", "aeir", "aers", "aeis", "eirs"],
    U5CC: "aeirs",
  }

  const filteredResults = applyFilterFunctions(unfilteredResults, filterFunctions)

  const testTable = new UKCCTable()
  for (const result of filteredResults) {
    testTable.registerWord(result)
  }

  const scoredWordList = scoreWordList(filteredResults, applicationTestSearchParameters, testTable)

  test("Create filter functions", () => {
    expect(filterFunctions).toBeArray()
    filterFunctions.forEach((f: Function) => {
      expect(f).toBeFunction()
    })
  })

  test("Filter by filter functions", async () => {
    // It should return several results
    expect(filteredResults.length).toBeGreaterThanOrEqual(1)
    // One of the results should be "arise"
    expect(filteredResults.find((w: WordMetadata) => w.word=="arise")).toMatchObject(anExpectedResult)
  })

  test("UKCC table should register results properly", () => {
    expect(testTable.U2CCs).toContainKey("ar")
    expect(testTable.U2CCs["ar"]).toBeGreaterThanOrEqual(2)

    // testTable.registerWord(anExpectedResult) 
    // // Now should count one more
    // expect(testTable.U2CCs["ar"]).toEqual(3)
  })
})


/**
 * 
 * @returns URLSearchParams with mock params
 */
function createTestURLSearchParams(): URLSearchParams {
  const testUSP = new URLSearchParams()
  testUSP.set("found", "_____")
  testUSP.set("has", "")
  testUSP.set("not", "z")

  return testUSP
}

