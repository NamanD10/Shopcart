"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "./auth-provider"

export function CartIcon() {
  const { user } = useAuth()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchCartCount()
    } else {
      setItemCount(0)
    }
  }, [user])

  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        const count = data.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setItemCount(count)
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error)
    }
  }

  if (!user) return null

  return (
    <Link href="/cart">
      <Button variant="outline" size="sm" className="relative bg-transparent">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Cart
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
