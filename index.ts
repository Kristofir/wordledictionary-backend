import { 
  search
} from "run/search/search";

import {
  defineArrayIntersectOverride
} from "run/helpers/array"

console.log("Server started");

defineArrayIntersectOverride()

Bun.serve({
  async fetch(req: Request) {
    console.log(req)
    const url = new URL(req.url);
    const { searchParams } = url

    if (url.pathname === "/search") {
      console.log("Search params: ", searchParams)
      const searchResults = await search(searchParams)
      
      return new Response(JSON.stringify(searchResults))
    };

    return new Response("Success!");
  },
});
