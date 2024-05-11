import { test, expect, describe, it } from "bun:test"

import type { UKCCDict } from "models/ukcc.ts"

import { 
  getAllUniqueKCharacterCombinations, 
  getUKCCString
} from "./UKCC.ts"

describe("Unique k-character combination operations", () => {
  test("Get UKCC combinations", () => {
    const desiredUKCCDictOutcome: UKCCDict = {
      "U2CCs": ["ar", "ai", "as", "ae", "ir", "rs", "er", "is", "ei", "es"], 
      "U3CCs": ["air", "ars", "aer", "ais", "aei", "aes", "irs", "eir", "ers", "eis"], 
      "U4CCs": ["airs", "aeir", "aers", "aeis", "eirs"], 
      "U5CC": "aeirs"
    }

    const UKCCDict = getAllUniqueKCharacterCombinations("arise")
    expect(UKCCDict).toMatchObject(desiredUKCCDictOutcome)
  })

  test("Valid U2CC", () => {
    const UKCCString = getUKCCString("arise", 0, 1)
    expect(UKCCString).toBe("ar")
  })

  test("Invalid U2CC", () => {
    const UKCCString = getUKCCString("arise", 0, 5)
    expect(UKCCString).toBeNull()
  })
})
