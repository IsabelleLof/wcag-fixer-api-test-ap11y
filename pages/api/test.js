// pages/api/test.js
import pa11y from "pa11y";

export default async function handler(req, res) {
  if (!req.query.url) {
    res.status(400).json({ error: "url is required" });
    return;
  }

  try {
    const results = await pa11y(req.query.url);
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
