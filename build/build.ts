import type { WordMetadata } from "models/WordMetadata"
import { getAllUniqueKCharacterCombinations } from "./helpers/UKCC";
import { createWordMetadata } from "./helpers/WordMetadataFactory";

const answersFile = Bun.file("build/words-answers.txt");
const nonanswersFile = Bun.file("build/words-nonanswers.txt");

const answerWords = (await answersFile.text()).split("\n")
const nonanswerWords = (await nonanswersFile.text()).split("\n")

const data = {
  answerWordMetadata: [] as WordMetadata[],
  nonanswerWordMetadata: [] as WordMetadata[]
}

function getAllWordMetadata(wordList: Word[]): WordMetadata[] {
  const wordMetadataList: WordMetadata[] = []

  for (const index in wordList) {
    const word = wordList[index]
    const wordMetadata = createWordMetadata(
      word,
      getAllUniqueKCharacterCombinations(word)
    )
    wordMetadataList.push(wordMetadata)
  }

  return wordMetadataList
}


data.answerWordMetadata = getAllWordMetadata(answerWords)
data.nonanswerWordMetadata = getAllWordMetadata(nonanswerWords)


await Bun.write("data/output.json", JSON.stringify(data));

