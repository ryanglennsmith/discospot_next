export default function handler(req, res) {
  const code = req.query.code;
  res.redirect(`/spot/${code}`);
}
