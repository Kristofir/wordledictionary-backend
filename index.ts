console.log("Server started");

Bun.serve({
  fetch(req: Request) {
    return new Response("Success!");
  },
});
