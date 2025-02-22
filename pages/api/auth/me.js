import { jwtVerify } from "jose";

export default async function handler(req, res) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret); // Decode the token
    console.log("payload", payload);
    res.status(200).json(payload); // Send the decoded user data
  } catch (error) {
    console.log("error", error);
    res.status(401).json({ message: "Invalid token" });
  }
}
