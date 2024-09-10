/**
 * The purpose of play.test.ts is to simulate an end-to-end game flow 
 */

import { describe, test, expect, mock } from "bun:test"

import { load } from "run/load"

import { defineArrayIntersectOverride } from "@helpers/array"

import { search } from "run/search/search"

defineArrayIntersectOverride()

describe("Play test", async () => {

  const wordLists = await load()
  const randomIndex = Math.floor(Math.random() * wordLists.answerWordMetadata.length)
  const randomAnswerWord = wordLists.answerWordMetadata[randomIndex].word

  const testUSP = new TestURLSearchParamsWrapper()

  console.log("Target answer:", randomAnswerWord)
  console.log("Begin play")

  test("Play several rounds and get all wrong", async () => {
    let expectedRemainingPossibleAnswersCount = 2309
    let lastRoundEliminations = 0

    // Play 6 rounds
    for (let round=0; round<6; round++) {
      const response = await search(testUSP.USP)
      const remainingPossibleAnswersCount = response.metadata.counts.remainingPossibleAnswers

      console.log(`Round ${round + 1} started with ${remainingPossibleAnswersCount} possible answers with ${lastRoundEliminations} eliminations from last round.`)

      if (remainingPossibleAnswersCount !== expectedRemainingPossibleAnswersCount) {
        console.error(`Expected ${expectedRemainingPossibleAnswersCount} possible answers, but got ${remainingPossibleAnswersCount} instead.`)
        console.error(testUSP.USP)
      }

      expect(remainingPossibleAnswersCount).toEqual(expectedRemainingPossibleAnswersCount)

      if (remainingPossibleAnswersCount === 0) {
        break
      }

      const randomIndex = Math.floor(Math.random() * response.metadata.counts.remainingPossibleAnswers)
      const randomAnswerWordResult = response.data.results.remainingPossibleAnswers[randomIndex]

      expectedRemainingPossibleAnswersCount = expectedRemainingPossibleAnswersCount  - randomAnswerWordResult.eliminations
      const randomAnswerWord = randomAnswerWordResult.word
      lastRoundEliminations = randomAnswerWordResult.eliminations

      console.log(`Guessing ${randomAnswerWord} with elimination power of ${randomAnswerWordResult.eliminations}.`)

      for (const character of randomAnswerWord.split('')) {
        testUSP.addNot(character)
      }
    }
  })
})



class TestURLSearchParamsWrapper {
  USP: URLSearchParams;
  found: string = "_____";
  has: Set<Character> = new Set();
  not: Set<Character> = new Set();

  constructor() {
    this.USP = new URLSearchParams()
    this.USP.set("found", "_____")
    this.USP.set("has", "")
    this.USP.set("not", "")
  }

  addNot(char: Character) {
    this.not.add(char)
    this.USP.set("not", Array.from(this.not).join(''))
  }
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