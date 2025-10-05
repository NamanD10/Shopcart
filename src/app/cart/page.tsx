import { getCurrentUser } from "@/lib/auth"
import { getCartItems } from "@/lib/db"
import { CartItems } from "@/components/cart-items"
import { CartSummary } from "@/components/cart-summary"
import { redirect } from "next/navigation"

export default async function CartPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const cartItems = await getCartItems(user.id)
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet</p>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems items={cartItems} />
          </div>
          <div className="lg:col-span-1">
            <CartSummary items={cartItems} buttonText="Proceed to Checkout" />
          </div>
        </div>
      )}
    </div>
  )
}
