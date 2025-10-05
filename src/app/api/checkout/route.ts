import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createOrder, addOrderItems, clearCart } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { items, total, shippingAddress } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Create order uisng user id
    const order = await createOrder(user.id, total)

    // Add order items to cart
    const orderItems = items.map((item: any) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.product_price,
    }))

    await addOrderItems(order.id, orderItems)

    // Clear cart after ordered
    await clearCart(user.id)

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
