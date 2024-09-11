declare global {
  type Word = string
  type Character = string
  /**
   * Unique K Character Combination
   */
  type UKCC = string
  /**
   * Unique K Character Set
   */
  type UKCSet = string // S is expanded for readability, makes it more visually distinct from UKCC

  type U2CC = UKCC
  type U3CC = UKCC
  type U4CC = UKCC
  type U5CC = UKCC

  type U2CSet = UKCSet
  type U3CSet = UKCSet
  type U4CSet = UKCSet
  type U5CSet = UKCSet


  interface Object {
    register(key: UKCC | Character): void;
  }
}

export {}
