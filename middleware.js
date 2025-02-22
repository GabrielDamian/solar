import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token"); // Get the token from cookies

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify the JWT token using 'jose'
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token.value, secret); // Throws an error if verification fails

    return NextResponse.next(); // Token is valid, allow the request
  } catch (error) {
    console.log("error", error);
    return NextResponse.redirect(new URL("/login", req.url)); // Invalid token, redirect to login
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard"], // Protect only the /dashboard route
};
