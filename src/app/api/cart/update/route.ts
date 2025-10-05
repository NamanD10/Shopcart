import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateCartItemQuantity } from "@/lib/db"

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { productId, quantity } = await request.json()

    if (!productId || quantity < 0) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 })
    }

    const result = await updateCartItemQuantity(user.id, productId, quantity)

    return NextResponse.json({ success: true, cartItem: result[0] || null })
  } catch (error) {
    console.error("Update cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
