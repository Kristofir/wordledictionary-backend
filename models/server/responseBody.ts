import { WordResult } from "@models/WordResult";

export interface SearchResponseBody {
  data: {
    results: WordResult[]
  },
  metadata: {
    count: number
  }
}

export type ResponseBody = SearchResponseBody