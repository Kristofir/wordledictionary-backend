import { describe, test, expect } from "bun:test"

import { 
  isAlphabeticOrUnderscore, 
  isAlphabetic 
} from "./alpha"

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