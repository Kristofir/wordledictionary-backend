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

export class UKCCTable {
  characters: Table<Character> = {}

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

    for (const character of wm.word.split('')) {
      this.characters.register(character)
    }

    for (const U2CC of wm.U2CCs) {
      this.U2CCs.register(U2CC)
    }

    for (const U3CC of wm.U3CCs) {
      this.U3CCs.register(U3CC)
    }

    for (const U4CC of wm.U4CCs) {
      this.U4CCs.register(U4CC)
    }

    this.U5CCs.register(wm.U5CC)
  }
  
}

