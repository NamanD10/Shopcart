"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useState } from "react"

interface CartItem {
  id: number
  user_id: string
  product_id: number
  product_name : string
  product_price: number
  quantity: number
}

interface CartSummaryProps {
  items: CartItem[],
}


export function CartSummary({ items : initialItems}: CartSummaryProps) {
  const [items, setItems] = useState(initialItems);
  
  const subtotal = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0)
  // console.log(items);
  // console.log(`Total for cart ${subtotal}`);
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {subtotal < 50 && (
          <p className="text-sm text-muted-foreground">Add ${(50 - subtotal).toFixed(2)} more for free shipping</p>
        )}

        <Button asChild className="w-full" size="lg">
          <Link href="/checkout">Continue to Checkout</Link>
        </Button>

        <Button variant="outline" asChild className="w-full bg-transparent">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
