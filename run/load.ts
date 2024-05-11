import { WordMetadata } from "models/WordMetadata";

export interface AllWordMetadata {
  answerWordMetadata: Array<WordMetadata>,
  nonanswerWordMetadata: Array<WordMetadata>
}

export async function load(): Promise<AllWordMetadata> {
  const path = "data/allWordMetadata.json";
  const file = Bun.file(path);

  const contents: AllWordMetadata = await file.json() 

  return contents
}