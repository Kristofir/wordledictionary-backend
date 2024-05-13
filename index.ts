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
