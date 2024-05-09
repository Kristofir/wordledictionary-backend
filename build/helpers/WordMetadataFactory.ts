import type { WordMetadata } from "models/WordMetadata"
import type { UKCCDict } from "models/ukcc"

export function createWordMetadata(w: Word, ukccDict: UKCCDict): WordMetadata {
  const wordMetadata = Object.assign(
    {
      word: w,
      U2CCs: ukccDict.U2CCs,
      U3CCs: ukccDict.U3CCs,
      U4CCs: ukccDict.U4CCs,
      U5CC: ukccDict.U5CC
    }
  )

  return wordMetadata
}