import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { addToCart } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { productId, productName, productPrice, quantity = 1 } = await request.json()

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 })
    }

    const result = await addToCart(user.id, productId, productName, productPrice, quantity);

    return NextResponse.json({ success: true, cartItem: result[0] })
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
