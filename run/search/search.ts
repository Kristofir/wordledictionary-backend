import type { IApplicationSearchParameters } from "models/Search";
import type { WordMetadata } from "models/WordMetadata";

import { load } from "../load";
import { 
  createFilterFunctions, 
  applyFilterFunctions 
} from "./filter";

import { 
  UKCCTable 
} from "./UKCCTable";

import { ApplicationSearchParameters } from "models/Search";

// Local types
export type FilterFunction = (w:WordMetadata)=>boolean

/**
 * Search function sequence
 * @param USP 
 */
export async function search(USP: URLSearchParams) {

  // Create filters from search parameters
  const applicationSearchParameters = new ApplicationSearchParameters(USP)
  const filterFunctions = createFilterFunctions(applicationSearchParameters)
  console.log(applicationSearchParameters)

  // Load word lists
  const words = await load()

  // Table to track the number of UKCCs among filtered answer results
  const table = new UKCCTable()

  const allAnswerWordMetadata = words.answerWordMetadata
  const allNonanswerWordMetadata = words.nonanswerWordMetadata
  
  const filteredAnswerWordMetadata = applyFilterFunctions(allAnswerWordMetadata, filterFunctions)

  for (const answerWordMetadata of filteredAnswerWordMetadata) {
    table.registerWord(answerWordMetadata)
  }

  console.log(table)
}
