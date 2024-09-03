import type { IApplicationSearchParameters } from "models/Search";
import type { WordMetadata } from "models/WordMetadata";
import { WordResult } from "@models/WordResult";

import { load } from "../load";
import { 
  createFilterFunctions, 
  applyFilterFunctions 
} from "./filter";

import { 
  UKCCTable 
} from "./UKCCTable";

import { ApplicationSearchParameters } from "models/Search";

import { scoreWordList, crunchWordMetadataList } from "./score";

import type { SearchResponseBodyV2 } from "@models/server/responseBody";

// Local types
export type FilterFunction = (w:Word)=>boolean

/**
 * Search function sequence
 * @param USP 
 */
export async function search(USP: URLSearchParams): Promise<SearchResponseBodyV2> {

  // Get current timestamp
  const startTimestamp = Date.now();

  // Create filters from search parameters
  const applicationSearchParameters = new ApplicationSearchParameters(USP)
  const filterFunctions = createFilterFunctions(applicationSearchParameters)
  console.log(applicationSearchParameters)

  // Load word lists
  const wordLists = await load()

  // Separate out answer and nonanswer word
  const allAnswerWordMetadata = wordLists.answerWordMetadata
  const allNonanswerWordMetadata = wordLists.nonanswerWordMetadata

  // Table to track the number of UKCCs among filtered answer results
  // We don't want to include nonanswer words, because this table will be used to score any word for its performance in eliminating answer candidates.
  const table = new UKCCTable()
  
  // Perform the actual filtering
  const filteredAnswerWordMetadata = applyFilterFunctions(allAnswerWordMetadata, filterFunctions)

  // Populate table with filtered answer words
  for (const answerWordMetadata of filteredAnswerWordMetadata) {
    table.registerWord(answerWordMetadata)
  }

  // Crunch data
  const answerWordResults = crunchWordMetadataList(
    allAnswerWordMetadata,
    applicationSearchParameters,
    table,
    true
  )
  const nonanswerWordResults = crunchWordMetadataList(
    allNonanswerWordMetadata,
    applicationSearchParameters,
    table,
    false // the difference from the previous
  )

  // Compute maximum possible answer score to use as a cutoff
  const possibleAnswerScores: number[] = answerWordResults.map((result) => result.eliminations)
  const maxPossibleAnswerScore = Math.max(...possibleAnswerScores)

  // Package results for response

  // Filter results into appropriate categories

  const remainingPossibleAnswers = answerWordResults.filter((result) => result.eliminations >= 0 && result.overlap == true)

  const highPotentialEliminatedPossibleAnswers = answerWordResults.filter((result) => result.eliminations >= maxPossibleAnswerScore && result.overlap == false)

  const lowPotentialEliminatedPossibleAnswers = answerWordResults.filter((result) => result.eliminations < maxPossibleAnswerScore && result.overlap == false)

  const highPotentialNonanswers = nonanswerWordResults.filter((result) => result.eliminations >= maxPossibleAnswerScore && result.overlap == false)

  const lowPotentialNonanswers = nonanswerWordResults.filter((result) => result.eliminations < maxPossibleAnswerScore && result.overlap == false)

  const searchResults: SearchResponseBodyV2 = 
  {
    data: {
      results:{
        remainingPossibleAnswers: remainingPossibleAnswers,
        eliminatedPossibleAnswers: {
          highPotential: highPotentialEliminatedPossibleAnswers,
          lowPotential: lowPotentialEliminatedPossibleAnswers
        },
        nonanswers: {
          highPotential: highPotentialNonanswers,
          lowPotential: lowPotentialNonanswers
        }
      }
    },
    metadata: {
      maxPossibleAnswerScore: maxPossibleAnswerScore,
      counts: {
        remainingPossibleAnswers: remainingPossibleAnswers.length,
        eliminatedPossibleAnswers: highPotentialEliminatedPossibleAnswers.length + lowPotentialEliminatedPossibleAnswers.length,
        nonanswers: highPotentialNonanswers.length + lowPotentialNonanswers.length
      },
      characterCounts: table.characters
    }
}


  const endTimestamp = Date.now();
  const duration = endTimestamp - startTimestamp;

  console.log(duration + "ms")

  return searchResults
}
