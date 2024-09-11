import { describe, test, expect, it } from "bun:test"

import { 
  search 
} from "run/search/search"

import {
  load
} from "../run/load"

import {
  createFilterFunctions,
  applyFilterFunctions
} from "../run/search/filter"

import {
  ScoringTable
} from "models/ScoringTable"

import { scoreWord } from "run/search/score"

// Models
import { ApplicationSearchParameters } from "models/Search"
// Types
import type { WordMetadata } from "@models/WordMetadata"
import { crunchWordMetadataList } from "run/search/score"

describe("Scoring", async () => {
  const testUSP = new TestURLSearchParamsWrapper("ab___")
  const testASP = new ApplicationSearchParameters(testUSP.USP)

  const filterFunctions = createFilterFunctions(testASP)

  const wordList = await load()
  const filteredWordMetadataList = wordList.answerWordMetadata.filter((result: WordMetadata) => result.word.startsWith("ab")) // purposefully constrain list to make it easier to test

  const table = new ScoringTable()

  filteredWordMetadataList.forEach((wm) => {
    table.registerWord(wm)
  })
  const sample = filteredWordMetadataList.find((wm) => wm.word == "abide")! // def exists

  const sampleScore = scoreWord(sample, testASP, table)

  const sampleList = crunchWordMetadataList(filteredWordMetadataList, testASP, table, true)

})

describe("Search", async () => {
  const testUSP = createTestURLSearchParams()
  const testASP = new ApplicationSearchParameters(testUSP)

  const filterFunctions = createFilterFunctions(testASP)

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

  const testTable = new ScoringTable()
  for (const result of filteredResults) {
    testTable.registerWord(result)
  }

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

describe("Search within simpler sublist", async () => {
  const testUSP = new TestURLSearchParamsWrapper("ab___")
  const testASP = new ApplicationSearchParameters(testUSP.USP)

  const wordLists = await load()
  const simpleAnswerWordList = wordLists.answerWordMetadata.filter(w => w.word.startsWith("ab"))

  const testTable = new ScoringTable()
  for (const result of simpleAnswerWordList) {
    testTable.registerWord(result)
  }

  const answerWordResults = crunchWordMetadataList(
    simpleAnswerWordList,
    testASP,
    testTable,
    true
  )

  const originalResultLength = answerWordResults.length

  const randomGuess = answerWordResults[Math.floor(Math.random() * originalResultLength)]


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



class TestURLSearchParamsWrapper {
  USP: URLSearchParams;
  found: string = "_____";
  has: Set<Character> = new Set();
  not: Set<Character> = new Set();

  constructor(found: string = "_____", has: string = "", not: string = "") {
    this.USP = new URLSearchParams()
    this.USP.set("found", found)
    this.USP.set("has", has)
    this.USP.set("not", not)
  }

  addNot(char: Character) {
    this.not.add(char)
    this.USP.set("not", Array.from(this.not).join(''))
  }
}