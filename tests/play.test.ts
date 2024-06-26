/**
 * The purpose of play.test.ts is to simulate an end-to-end game flow 
 */

import { describe, test, expect, mock } from "bun:test"

import { load } from "run/load"

describe("Play test", async () => {

  const wordLists = await load()
  const randomIndex = Math.floor(Math.random() * wordLists.answerWordMetadata.length)
  const randomAnswerWord = wordLists.answerWordMetadata[randomIndex].word

  console.log("Target answer:", randomAnswerWord)
  console.log("Begin play")

  test("Play several rounds", () => {

    // Play 6 rounds
    for (let round=0; round<6; round++) {
      
    }

  })
})

function createTestURLSearchParams(): URLSearchParams {
  const testUSP = new URLSearchParams()
  testUSP.set("found", "_____")
  testUSP.set("has", "")
  testUSP.set("not", "z")

  return testUSP
}

/**
 * start with random answer word
 * create empty search params
 * perform search and get res list
 * check if answer reached, if not then...
 * sort res list by elimination power
 * choose top word
 * evaluate against answer word
 * create new search params with evaluation results
 * perform new search and get new res list
 * loop
 */