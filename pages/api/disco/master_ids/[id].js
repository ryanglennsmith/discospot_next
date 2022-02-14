export default async function handler(req, res) {
  const query = await req.query.id;
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
