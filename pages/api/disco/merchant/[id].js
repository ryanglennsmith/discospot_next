export default async function handler(req, res) {
  const merchant = await req.query.id;

  const url = `https://api.discogs.com/marketplace/listings/${encodeURIComponent(
    merchant
  )}`;
  const headers = {
    headers: {
      Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
      "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
    },
  };
  const response = await fetch(url, headers);
  const data = await response.json();
  const payload = {
    uri: data.uri,
    ships_from: data.ships_from,
    price: data.original_price.formatted,
    shipping: data.original_shipping_price.formatted,
    image: data.release.images[0].uri,
  };
  res.json({ data: payload });
}
