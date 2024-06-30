import { parseArgs } from "util";

import { 
  search
} from "run/search/search";

import {
  defineArrayIntersectOverride
} from "run/helpers/array"

import { createCompressedResponse } from "server/compress"

import type {
  SearchResponseBody
} from "models/server/responseBody"

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
      const searchResults = await search(searchParams)

      const searchResponseBody: SearchResponseBody = {
        data: {
          results: searchResults
        },
        metadata: {
          count: searchResults.length
        }
      }

      const compressedResponse = createCompressedResponse(searchResponseBody)
      
      return compressedResponse
    };

    return new Response("Success!");
  },
});
