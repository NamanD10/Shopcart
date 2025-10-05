import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { OrdersList } from "@/components/orders-list"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const orders = await sql`
    SELECT o.*, 
           COUNT(oi.id) as item_count,
           ARRAY_AGG(
             JSON_BUILD_OBJECT(
               'name', p.name,
               'quantity', oi.quantity,
               'price', oi.price
             )
           ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ${user.id}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <OrdersList orders={orders} />
    </div>
  )
}
