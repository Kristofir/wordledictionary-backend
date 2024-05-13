declare global {
  type Word = string
  type Character = string
  type UKCC = string

  type U2CC = UKCC
  type U3CC = UKCC
  type U4CC = UKCC
  type U5CC = UKCC


  interface Array<T> {
    intersects(array: Array<T>): boolean;
  }

  interface Object {
    register(key: UKCC | Character): void;
  }
}

export {}
