export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const imageURL = url.searchParams.get("url");

    if (!imageURL) {
      return new Response("Missing 'url' parameter", { status: 400 });
    }

    const options = {
      cf: {
        image: {
          fit: "scale-down",
          width: url.searchParams.get("w") || 800,
          quality: url.searchParams.get("q") || 75,
          format: "webp"
        }
      }
    };

    const imageRequest = new Request(imageURL, {
      headers: request.headers
    });

    return fetch(imageRequest, options);
  }
};
