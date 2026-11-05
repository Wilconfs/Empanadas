// src/app/dashboard/pos/actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function registerSale(
  cart: { productId: number, quantity: number, subtotal: number }[], 
  total: number,
  paymentMethod: string
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Crear la venta con el método de pago elegido
      await tx.sale.create({
        data: {
          total,
          paymentMethod,
          items: {
            create: cart.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              subtotal: item.subtotal
            }))
          }
        }
      });

      // 2. Descontar del inventario los ingredientes
      for (const cartItem of cart) {
        const productWithRecipe = await tx.product.findUnique({
          where: { id: cartItem.productId },
          include: {
            recipe: {
              include: { ingredient: true }
            }
          }
        });

        if (productWithRecipe) {
          for (const recipeItem of productWithRecipe.recipe) {
            const totalQuantityToSubtract = recipeItem.quantity * cartItem.quantity;
            await tx.ingredient.update({
              where: { id: recipeItem.ingredientId },
              data: {
                currentStock: {
                  decrement: totalQuantityToSubtract
                }
              }
            });
          }
        }
      }
    });

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/inventory');
    
    return { success: true };
  } catch (error) {
    console.error("Error al registrar venta:", error);
    return { success: false, error: "Hubo un problema al guardar la venta." };
  }
}