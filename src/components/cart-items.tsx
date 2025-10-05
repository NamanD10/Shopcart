"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { FakestoreProduct, fetchProductById } from "@/lib/fakestore-api"

interface CartItem {
  id: number
  user_id: string
  product_id: number
  product_name : string
  product_price: number
  quantity: number
}

interface CartItemsProps {
  items: CartItem[]
}

interface CartItemWithDetails extends CartItem {
  productDetails: FakestoreProduct | null
}

export function CartItems({ items: initialItems }: CartItemsProps) {
  const [items, setItems] = useState(initialItems);
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
  const [itemsWithDetails, setItemsWithDetails] = useState<CartItemWithDetails[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchAllProductDetails = async () => {
      setIsLoadingDetails(true)
      try {
        const itemsWithDetailsPromises = items.map(async (item) => {
          const productDetails = await fetchProductById(item.product_id) 
          return {
            ...item,
            productDetails,
          }
        })

        const resolvedItems = await Promise.all(itemsWithDetailsPromises)
        setItemsWithDetails(resolvedItems)
      } catch (error) {
        console.error("Error fetching product details:", error)
        toast("Error", {
          description: "Failed to load product details",
        })
      } finally {
        setIsLoadingDetails(false)
      }
    }

    if (items.length > 0) {
      fetchAllProductDetails()
    } else {
      setItemsWithDetails([])
      setIsLoadingDetails(false)
    }
  }, [items]);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    setLoadingItems((prev) => new Set(prev).add(productId))

    try {
      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity,
        }),
      })

      if (response.ok) {
        if (newQuantity === 0) {
          setItems((prev) => prev.filter((item) => item.product_id !== productId))
          toast("Item removed", {
            description: "Item has been removed from your cart",
          })
        } else {
          setItems((prev) =>
            prev.map((item) => (item.product_id === productId ? { ...item, quantity: newQuantity } : item)),
          )
        }
      } else {
        throw new Error("Failed to update cart")
      }
    } catch (error) {
      toast("Error", {
        description: "Failed to update cart item",
      })
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const removeItem = async (productId: number) => {
    await updateQuantity(productId, 0)
  }

  if (isLoadingDetails) {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 flex-shrink-0 bg-gray-200 animate-pulse rounded-md" />
                <div className="flex-1 min-w-0">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-2" />
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {itemsWithDetails.map((item) => {
        const product = item.productDetails
        if (!product) return null

        return (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image
                    src={product.image || "/placeholder.svg?height=80&width=80"}
                    alt={item.product_name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{item.product_name}</h3>
                  <p className="text-2xl font-bold text-primary">${item.product_price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    disabled={loadingItems.has(item.product_id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-12 text-center font-semibold">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    disabled={loadingItems.has(item.product_id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">${(item.product_price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.product_id)}
                    disabled={loadingItems.has(item.product_id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
