export interface WordResult {
  word: Word,

  /**
   * The word overlaps with search criteria
   */
  overlap: boolean

  /**
   * Word is a possible solution
   */
  solution: boolean,

  /**
   * Number of remaining solutions this word would eliminate if guessed
   */
  eliminations: number,
}