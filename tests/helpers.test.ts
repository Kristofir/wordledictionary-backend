import { describe, test, expect } from "bun:test"

import { 
  isAlphabeticOrUnderscore, 
  isAlphabetic,
  orderAlbhabetically
} from "@helpers/alpha"

import {
  hasOverlap
} from "@helpers/word"

import { doArraysIntersect } from "@helpers/array"

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

  test("Order alphabetically", () => {
    const ordered1 = orderAlbhabetically("arise")
    expect(ordered1).toBe("aeirs")

    const ordered2 = orderAlbhabetically("eirz")
    expect(ordered2).toBe("eirz")

    const ordered3 = orderAlbhabetically("zero")
    expect(ordered3).toBe("eorz")
  })
})

describe("Array helpers", () => {
  test("Array intersection", () => {
    const arrA = [1, 2]
    const arrB = [2, 3]
    const arrC = [4]

    const hasIntersection = doArraysIntersect(arrA, arrB)
    const noIntersection = doArraysIntersect(arrA, arrC)

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