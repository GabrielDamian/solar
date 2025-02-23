export default async function handler(req, res) {
  const response = await fetch(process.env.ESP_URL);
  const data = await response.text();
  res.status(200).send(data);
}
