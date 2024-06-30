import { ResponseBody } from "@models/server/responseBody";

const CONTENT_TYPE_HTML = 'text/html';
const CONTENT_ENCODING_GZIP = 'gzip';

/**
 * Create a compressed response with a given ResponseBody
 * 
 * @param data valid response body as defined in models
 * @returns gzip compressed response
 */
export function createCompressedResponse(data: ResponseBody): Response {
  const compressedData = Bun.gzipSync(JSON.stringify(data));
  const response = new Response(compressedData);

  // Set common headers
  response.headers.set('Content-Type', CONTENT_TYPE_HTML);
  response.headers.set('Content-Encoding', CONTENT_ENCODING_GZIP);

  // Set development-specific headers
  if (process.env.NODE_ENV === 'development') {
    response.headers.append('Access-Control-Allow-Origin', '*');
    response.headers.append('Cross-Origin-Resource-Policy', 'cross-origin');
    response.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }

  return response;
}