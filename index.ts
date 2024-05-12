import { 
  search, 
  createApplicationSearchParameters 
} from "run/search/search";

console.log("Server started");

Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);
    const { searchParams } = url

    if (url.pathname === "/search") {
      console.log("Search params: ", searchParams)
      search(searchParams)
      
      return new Response("Ok")
    };

    return new Response("Success!");
  },
});
