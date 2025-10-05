export interface FakestoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export async function fetchProductsFromFakestore(): Promise<FakestoreProduct[]> {
  try {
    
    const response = await fetch('https://fakestoreapi.com/products')

    if (!response.ok) {
      throw new Error(`Fakestore API error: ${response.status}`)
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error("Error fetching products from Fakestore:", error)
    
    return []
  }
}

export async function fetchProductById(id:number): Promise<FakestoreProduct | null> {
  try {
    
    const response = await fetch(`https://fakestoreapi.com/products/${id}`)

    if (!response.ok) {
      throw new Error(`Fakestore API error: ${response.status}`)
    }

    const data = await response.json()
    return data || {}
  } catch (error) {
    console.error("Error fetching products from Fakestore:", error)
    
    return null
  }
}
