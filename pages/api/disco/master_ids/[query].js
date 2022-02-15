export default async function handler(req, res) {
  const query = await req.query.query;
  const artist = query.match(/a=\w+.+(?=&)/)[0].split("=")[1];
  const title = query.match(/&t=\w+.+/)[0].split("=")[1];
  const url = `https://api.discogs.com/database/search?release_title=${encodeURIComponent(
    title
  )}&artist=${encodeURIComponent(artist)}&type=master`;
  const headers = {
    headers: {
      Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
      "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
    },
  };
  const response = await fetch(url, headers);
  const data = await response.json();
  res.json({ master_id: data.results[0].master_id });
}
/* 
const discoFetch = async () => {
      const url = `https://api.discogs.com/database/search?release_title=${encodeURIComponent(
        query.title
      )}&artist=${encodeURIComponent(query.artist)}&type=master`;
      const headers = {
        headers: {
          Authorization: `Discogs token=${process.env.NEXT_PUBLIC_DISCO_ACCESS_TOKEN}`,
          "User-Agent": `"${process.env.NEXT_PUBLIC_DISCO_USER_AGENT}"`,
        },
      };
*/
