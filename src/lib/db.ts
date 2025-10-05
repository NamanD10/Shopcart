import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export async function getCartItems(userId: number) {
  return await sql`
    SELECT ci.*
    FROM cart_items ci
    WHERE ci.user_id = ${userId}
    ORDER BY ci.created_at DESC
  `
}

export async function addToCart(userId: number, productId: number, productName: string, productPrice: number, quantity = 1) {
  return await sql`
    INSERT INTO cart_items (user_id, product_id, product_name, product_price, quantity)
    VALUES (${userId}, ${productId}, ${productName}, ${productPrice}, ${quantity})
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET 
      quantity = cart_items.quantity + ${quantity},
      updated_at = NOW()
    RETURNING *
  `
}

export async function updateCartItemQuantity(userId: number, productId: number, quantity: number) {
  if (quantity <= 0) {
    return await sql`
      DELETE FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `
  }

  return await sql`
    UPDATE cart_items 
    SET quantity = ${quantity}, updated_at = NOW()
    WHERE user_id = ${userId} AND product_id = ${productId}
    RETURNING *
  `
}

export async function removeFromCart(userId: number, productId: number) {
  return await sql`
    DELETE FROM cart_items 
    WHERE user_id = ${userId} AND product_id = ${productId}
  `
}

export async function clearCart(userId: number) {
  return await sql`
    DELETE FROM cart_items 
    WHERE user_id = ${userId}
  `
}

export async function createOrder(userId: number, totalAmount: number) {
  const result = await sql`
    INSERT INTO orders (user_id, total_amount)
    VALUES (${userId}, ${totalAmount})
    RETURNING *
  `
  return result[0]
}

export async function addOrderItems(
  orderId: number,
  items: Array<{ productId: number; quantity: number; price: number }>,
) {
  const values = items.map((item) => `(${orderId}, ${item.productId}, ${item.quantity}, ${item.price})`).join(", ")

  return await sql`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES ${sql.unsafe(values)}
  `
}
