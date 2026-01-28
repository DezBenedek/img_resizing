export default {
  async fetch(request) {
    const url = new URL(request.url);
    let imageURL = url.searchParams.get("url");
    const width = url.searchParams.get("w");
    const height = url.searchParams.get("h");
    const quality = url.searchParams.get("q") || "75";

    if (!imageURL) {
      return new Response("Hianyzik az 'url' parameter", { status: 400 });
    }

    if (imageURL.startsWith("data:image")) {
      const base64Data = imageURL.split(",")[1];
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      return new Response(binaryData, {
        headers: { "Content-Type": "image/png" } 
      });
    }

    const cleanUrl = imageURL.replace(/^https?:\/\//, "");
    let photonParams = `?quality=${quality}&strip=all`;
    
    if (width && !height) {
      photonParams += `&w=${width}`;
    } else if (height && !width) {
      photonParams += `&h=${height}`;
    } else if (width && height) {
      photonParams += `&fit=${width},${height}`;
    }

    const photonUrl = `https://i0.wp.com/${cleanUrl}${photonParams}`;

    return fetch(photonUrl, {
      headers: { "User-Agent": "Cloudflare-Image-Proxy" }
    });
  }
};
