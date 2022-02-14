import getSellersList from "../../../../utils/nodescraper";

export default async function handler(req, res) {
  const seller = await req.query.id;
  const data = await getSellersList(seller);
  res.json({ sellers: data });
}
