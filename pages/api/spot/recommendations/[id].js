export default async function handler(req, res) {
  const recommendation = await req.query.id;
  const accessToken = await req.cookies.access_token;
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_artists=${encodeURIComponent(
      recommendation
    )}&limit=5`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await response.json();
  res.json({ data: data });
}
