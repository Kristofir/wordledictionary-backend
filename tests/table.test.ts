import { describe, test, expect, it } from "bun:test"

import { ScoringTable } from "@models/ScoringTable"
import { load } from "run/load"


describe("Scoring table", async () => {
  const table = new ScoringTable()

  const wordList = await load()
  const unfilteredResults = wordList.answerWordMetadata


  test("Register several samples", () => {

    const sample1 = unfilteredResults.find(w => w.word === "abate")
    const sample2 = unfilteredResults.find(w => w.word === "abide")
    const sample3 = unfilteredResults.find(w => w.word === "about")
    
    table.registerWord(sample1!)
    table.registerWord(sample2!)
    table.registerWord(sample3!)
    
    expect(table.characters['a']).toEqual(3)
    expect(table.U2CCs['ab']).toEqual(3)
  })
})