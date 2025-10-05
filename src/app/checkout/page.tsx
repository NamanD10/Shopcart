import { getCurrentUser } from "@/lib/auth"
import { getCartItems } from "@/lib/db"
import { CheckoutForm } from "@/components/checkout-form"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const cartItems = await getCartItems(user.id)

  if (cartItems.length === 0) {
    redirect("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm cartItems={cartItems} user={user} />
    </div>
  )
}
