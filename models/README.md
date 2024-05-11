# Definitions

Several words—valid, answer, and nonanswer—are used throughout the project. To minimize any possible confusion, I have defined here.

## Valid

Any word that the Wordle game accepts as a guess is *valid*. Not all *valid* words, however, are [answers](#answer).

All words in the `words-answers.txt` and `words-nonanswers.txt` word lists are valid.

## Answer

A word that is a possible solution is an *answer*.

## Nonanswer

A word that is accepted as a guess but is **not a possible solution** is a nonanswer. It sounds silly, but it's true.

# Models

Models is a slight misnomer, but I like it here.

You will see `UKCC` and its derivative forms (`U2CC`, etc.) `WordMetadata`, and `WordResult` used throughout the project. Understanding them will help make easier the task of understanding the entire project.

## UKCC

*Stands for <u>unique k-character combination</u>.*

`UKCC`s are used for fast and efficient computation of the number of remaining possible solutions that a word, if guessed, would eliminate.

In this application there are `U2CC`s, `U3CC`s, `U4CC`s, and `U5CC`s. They are 2, 3, 4, and 5 characters long strings, respectively.

Characters in a `UKCC` are:

* Unique. For example, a 3-character combination like `ees` is not valid and will be ignored.
* Alphabetically ordered. For example, the `U5CC` of the word "asset" is `aesst` — and so is that of the word "easts".

# WordMetadata

A `WordMetadata` stores a valid word and its unique k-character combinations.

For simplicity, all `WordMetadata` are stored not in a database but in a plain JSON file called `allWordMetadata.json` in two separate arrays: `answerWordMetadata` and `nonanswerWordMetadata`.

# WordResult

A `WordResult` 