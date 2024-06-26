import { parseArgs } from "util";

import { 
  search
} from "run/search/search";

import {
  defineArrayIntersectOverride
} from "run/helpers/array"

console.log("Server started");

defineArrayIntersectOverride()


const { values } = parseArgs({
  args: Bun.argv,
  options: {
    watch: {
      type: 'boolean',
    },
    dev: {
      type: 'boolean',
    },
  },
  strict: false,
  allowPositionals: true,
});

if (values.dev) {
  process.env.NODE_ENV = 'development'
}

Bun.serve({
  development: values.dev ? true : false,
  async fetch(req: Request) {
    console.log(req)
    const url = new URL(req.url);
    const { searchParams } = url

    if (url.pathname === "/search") {
      console.log("Search params: ", searchParams)
      const searchResults = await search(searchParams)

      const compressedSearchResults = Bun.gzipSync(JSON.stringify(searchResults))

      const response = new Response(compressedSearchResults);

      response.headers.set('Content-Type', 'text/html');
      response.headers.set('Content-Encoding', 'gzip');

      console.log(process)

      if (process.env.NODE_ENV === 'development') {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      }

      console.log(response.headers)
      
      return response
    };

    return new Response("Success!");
  },
});
