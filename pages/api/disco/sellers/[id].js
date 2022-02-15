import getSellersList from "../../../../utils/nodescraper";

export default async function handler(req, res) {
  const masterId = await req.query.id;
  const data = await getSellersList(masterId);
  res.json({ sellers: data });
}
