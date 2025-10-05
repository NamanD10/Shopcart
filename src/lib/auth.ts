import { sql } from "./db"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const JWT_ALGORITHM = "HS256"

export interface User {
  id: number
  email: string
  name: string
  created_at: string
}

export interface AuthTokenPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Generate JWT token
export async function generateToken(user: User): Promise<string> {
  return await new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AuthTokenPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

// Get current user from request
export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    const result = await sql`
      SELECT * FROM users 
      WHERE id = ${payload.userId}
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Create or update user (for OAuth callback)
export async function createOrUpdateUser(userData: {
  email: string
  name: string
}): Promise<User | null> {
  try {const result = await sql`
    INSERT INTO users (email, name, created_at, updated_at)
    VALUES (${userData.email}, ${userData.name}, NOW(), NOW())
    ON CONFLICT (email)
    DO UPDATE SET
      name = EXCLUDED.name,
      updated_at = NOW()
    RETURNING *
  `

  return result[0]
  } catch (error) {
    console.error("Error creating or updating user:", error)
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token")
}
