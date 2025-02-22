import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../lib/mongodb";
import {
  getUser,
  createUser,
} from "../../backend/persistence/user.persistence";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { action, name, email, password, role } = req.body;

  try {
    await connectToDatabase();

    switch (action) {
      case "register": {
        // Check if user already exists
        const existingUser = await getUser({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await createUser({
          name,
          email,
          password: hashedPassword,
          role,
        });

        return res
          .status(201)
          .json({ message: "User created successfully", user });
      }

      case "login": {
        // Fetch user
        const user = await getUser({ email });
        if (!user) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
          {
            name: user.name,
            email: user.email,
            _id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2d" }
        );

        // Set cookie
        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600 * 24 * 2, // 2 days
            path: "/",
          })
        );

        return res.status(200).json({
          message: "Login successful",
          name: user.name,
          email: user.email,
          role: user.role,
          _id: user._id,
        });
      }

      case "logout": {
        // Clear the authentication cookie
        res.setHeader(
          "Set-Cookie",
          serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0),
            path: "/",
          })
        );

        return res.status(200).json({ message: "Logged out successfully" });
      }

      default: {
        return res.status(400).json({ message: "Invalid action" });
      }
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}
