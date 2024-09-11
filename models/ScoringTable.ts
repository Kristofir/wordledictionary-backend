import { WordMetadata } from "models/WordMetadata"

type Table<K extends UKCC|Character> = {
  [key in K]: number;
}

Object.defineProperty(Object.prototype, "register", {
  configurable: false,
  writable: false,
  value: function (key: UKCC|Character) {
    this[key] ? this[key]+=1 : this[key]=1
  }
})

/**
 * Renamed 
 */
export class ScoringTable {
  characters: Table<Character> = {}

  answersCount: number = 0 // Will serve as denominator for elimination percentage calculations

  // Unique K Character Combinations / Ordered K Character Sets
  U2CCs: Table<U2CC> = {}
  U3CCs: Table<U3CC> = {}
  U4CCs: Table<U4CC> = {}
  U5CCs: Table<U5CC> = {}

  // Unique K Character Sets / Unordered K Character Sets
  U2CSets: Table<U2CSet> = {}
  U3CSets: Table<U3CSet> = {}
  U4CSets: Table<U4CSet> = {}
  U5CSets: Table<U5CSet> = {}

  constructor() {
  }

  registerWord(wm: WordMetadata) {

    Array.from(new Set(wm.word.split(''))).forEach((character) => {
      this.characters.register(character)
    })

    wm.U2CCs.forEach((U2CC) => {
      this.U2CCs.register(U2CC)
    })

    wm.U3CCs.forEach((U3CC) => {
      this.U3CCs.register(U3CC)
    })

    wm.U4CCs.forEach((U4CC) => {
      this.U4CCs.register(U4CC)
    })

    if (wm.U5CC) {
      this.U5CCs.register(wm.U5CC)
    }
  }
  
}

