import { WordMetadata } from "models/WordMetadata"

type Table<K extends UKCC|Character> = {
  [key in K]: number;
}

declare global {
  interface Object {
    register(key: UKCC|Character): void;
  }
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
  U2CCs: Table<U2CC> = {}
  U3CCs: Table<U3CC> = {}
  U4CCs: Table<U4CC> = {}
  U5CCs: Table<U5CC> = {}

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

