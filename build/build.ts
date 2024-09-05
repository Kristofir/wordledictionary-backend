import type { WordMetadata } from "models/WordMetadata"
import { getAllUniqueKCharacterCombinations } from "./helpers/UKCC";
import { createWordMetadata } from "../models/factories/WordMetadataFactory";

const answersFile = Bun.file("build/words-answers.txt");
const nonanswersFile = Bun.file("build/words-nonanswers.txt");

const answerWords = (await answersFile.text()).split("\n")
const nonanswerWords = (await nonanswersFile.text()).split("\n")

const data = {
  answerWordMetadata: [] as WordMetadata[],
  nonanswerWordMetadata: [] as WordMetadata[]
}

function getAllWordMetadata(
  wordList: Word[],
  possibleAnswers: boolean,
): WordMetadata[] {
  const wordMetadataList: WordMetadata[] = []

  for (const index in wordList) {
    const word = wordList[index]

    // This is kind of a hack to prevent the same word from being included in both answer and nonanswer lists
    // I learned that the nonanswer words list contains answer words
    if (possibleAnswers == false && answerWords.includes(word)) {
      continue
    }

    const wordMetadata = createWordMetadata(
      word,
      possibleAnswers,
      getAllUniqueKCharacterCombinations(word)
    )
    wordMetadataList.push(wordMetadata)
  }

  return wordMetadataList
}


data.answerWordMetadata = getAllWordMetadata(answerWords, true)
data.nonanswerWordMetadata = getAllWordMetadata(nonanswerWords, false)


await Bun.write("data/allWordMetadata.json", JSON.stringify(data))
  .then(() => {
    console.log("Word data compilation successful.")
  })
  .catch((error) => {
    console.error("Word data compilation failed.")
    console.error(error)
  })
