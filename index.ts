import { parseArgs } from "util";

import { 
  search
} from "run/search/search";


import { createCompressedResponse } from "server/compress"

import type {
  SearchResponseBodyV2
} from "@models/server/responseBody"

console.log("Server started");


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
      const searchResponseBody: SearchResponseBodyV2 = await search(searchParams)

      const compressedResponse = createCompressedResponse(searchResponseBody)
      
      return compressedResponse
    };

    return new Response("Success!");
  },
});
