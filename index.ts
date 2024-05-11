import { 
  search, 
  createWordleDictionarySearchParameters 
} from "run/search";

console.log("Server started");

Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);
    const { searchParams } = url

    if (url.pathname === "/search"){
      console.log("Search params: ", searchParams)
      console.log(searchParams.get("found"))

      const applicationSearchParameters = createWordleDictionarySearchParameters(searchParams)

      console.log(applicationSearchParameters)
      
      const results = await search(applicationSearchParameters)
      
      return new Response("Ok")
    };

    return new Response("Success!");
  },
});
