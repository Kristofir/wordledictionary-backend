import { describe, test, expect } from "bun:test"

import { 
  isAlphabeticOrUnderscore, 
  isAlphabetic 
} from "./alpha"

import {
  hasOverlap
} from "./word"

import { IApplicationSearchParameters } from "models/Search"

describe("Alphabetic helpers", () => {
  test("is Alphabetic", () => {
    expect(isAlphabetic("arise")).toBeTrue

    // Introduce number
    expect(isAlphabetic("ari4e")).toBeFalse

    // Introduce underscore
    expect(isAlphabetic("ari_e")).toBeFalse
  })


  test("is Alphabetic or Underscore", () => {
    // Now the string with a underscore should be valid
    expect(isAlphabetic("ari_e")).toBeTrue
    expect(isAlphabetic("arise")).toBeTrue

    expect(isAlphabetic("ari4e")).toBeFalse
  })
})

describe("Array helpers", () => {
  test("Array intersection", () => {
    const arrA = [1, 2]
    const arrB = [2, 3]
    const arrC = [4]

    const hasIntersection = arrA.intersects(arrB)
    const noIntersection = arrA.intersects(arrC)

    expect(hasIntersection).toBeTrue()
    expect(noIntersection).toBeFalse()
  })
})

describe("Word helpers", () => {
  const searchParameters: IApplicationSearchParameters = {
    charactersWithPositions: ["a", "_", "_", "_", "_"],
    charactersWithoutPositions: ["e"],
    charactersEliminated: ["y"],
    allFoundCharacters: [],
    notFoundCharacters: []
  } // using interface instead of object

  test("Word overlap with search parameters", () => {
    const word = "arise"

    const overlap = hasOverlap(word, searchParameters)
    expect(overlap).toBeTrue()
  })

  test("Word non-overlap with search parameters", () => {
    const word = "yearn"

    const overlap = hasOverlap(word, searchParameters)
    expect(overlap).toBeFalse()
  })
})