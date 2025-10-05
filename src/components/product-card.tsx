"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useState } from "react"
import { toast } from "sonner"

 interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!user) {
      toast("Please sign in", {
        description: "You need to be signed in to add items to cart",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          productName : product.title,
          productPrice: product.price,
          quantity: 1,
        }),
      })
         if(response.ok){
          toast("Added to cart", {
            description: `${product.title} added to cart`,
          })
         } else {
          throw new Error("Failed to add to cart");
         }
    } catch (error) {
      toast("Error", {
        description: "Failed to add item to cart",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <button className="absolute top-2 left-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
