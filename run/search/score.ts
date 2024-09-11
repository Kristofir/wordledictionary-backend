import type { WordMetadata } from "@models/WordMetadata"
import type { WordResult } from "@models/WordResult"
import { ApplicationSearchParameters } from "@models/Search"

import { ScoringTable } from "../../models/ScoringTable"

import { hasOverlap } from "@helpers/word"

import { doArraysIntersect } from "@helpers/array"

/**
 * Basically takes in a of WordMetadata (internal representation) and returns a list of WordResult (external presentation)
 * 
 * @param wl Word List
 * @param asp Application Search Parameters (not URLSearchParams)
 * @param table Scoring Table
 * @param possibleAnswer Admittedly a hacky way to pass this information down the line.
 * @returns 
 */
export function crunchWordMetadataList(
  wl: WordMetadata[],
  asp: ApplicationSearchParameters,
  table: ScoringTable,
  possibleAnswer: boolean // A little lazy, but this is a quick way to pass this information down the line.
): WordResult[] {

  const wordResultList: WordResult[] = []

  for (const wm of wl) {
    const eliminationScore = scoreWord(wm, asp, table)

    const wordResult: WordResult = {
      word: wm.word,
      overlap: hasOverlap(wm.word, asp),
      possibleAnswer: possibleAnswer,
      eliminations: eliminationScore,
      eliminationsPct: Math.round(eliminationScore / table.answersCount * 10000) / 100
    }
    // REDO THIS

    wordResultList.push(wordResult)
  }

  return wordResultList
}

export function scoreWord(
  wm: WordMetadata, 
  asp: ApplicationSearchParameters,
  table: ScoringTable
): number {

  let score = 0

  const wordCharacters = wm.word.split('') // arise -> a,r,i,s,e
  const uniqueWordCharacters = Array.from(new Set(wordCharacters)) // s,l,e,e,p -> s,l,e,p

  const notFoundUniqueWordCharacters = uniqueWordCharacters.filter((c: Character) => asp.notFoundCharacters.includes(c))

  let notFoundU2CCs: U2CC[] = wm.U2CCs.filter(
    U2CC => !doArraysIntersect(asp.allFoundCharacters, U2CC.split(''))
  )
  let notFoundU3CCs: U3CC[] = wm.U3CCs.filter(
    U3CC => !doArraysIntersect(asp.allFoundCharacters, U3CC.split(''))
  )
  let notFoundU4CCs: U4CC[] = wm.U4CCs.filter(
    U4CC => !doArraysIntersect(asp.allFoundCharacters, U4CC.split(''))
  )
  let notFoundU5CC: U5CC[] = wm.U5CC && !doArraysIntersect(asp.allFoundCharacters, uniqueWordCharacters) ? [wm.U5CC] : []


  let parsedUKCCs: Record<UKCC, number> = {}

  if (notFoundU5CC[0]) {
    parsedUKCCs[notFoundU5CC[0]] = table.U5CCs[notFoundU5CC[0]];
  }

  if (notFoundU4CCs) {
    for (const U4CC of notFoundU4CCs) {
      let subscore = table.U4CCs[U4CC];
      parsedUKCCs[U4CC] = -subscore;
    }
  }

  if (notFoundU3CCs) {
    for (const U3CC of notFoundU3CCs) {
      let subscore = table.U3CCs[U3CC];
      parsedUKCCs[U3CC] = subscore;
    }
  }

  if (notFoundU2CCs) {
    for (const U2CC of notFoundU2CCs) {
      let subscore = table.U2CCs[U2CC];
      parsedUKCCs[U2CC] = -subscore;
    }
  }


  for (const character of notFoundUniqueWordCharacters) {
    let subscore = table.characters[character];
    parsedUKCCs[character] = subscore;
  }

  for (const [k, v] of Object.entries(parsedUKCCs)) {
    if (v) score += v;
  }

  return score
}