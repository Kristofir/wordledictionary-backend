export interface WordMetadata {
  word: Word,
  possibleAnswer: boolean,
  U2CCs: UKCC[],
  U3CCs: UKCC[],
  U4CCs: UKCC[],
  U5CC: UKCC
}
