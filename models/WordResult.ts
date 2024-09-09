export interface WordResult {
  word: Word,

  /**
   * The word overlaps with search criteria
   */
  overlap: boolean

  /**
   * Word is a possible answer
   */
  possibleAnswer: boolean,

  /**
   * Number of remaining possible answers this word would eliminate if guessed
   */
  eliminations: number,

  /**
   * Percentage of remaining possible answers this word would eliminate if guessed
   */
  eliminationsPct: number
}