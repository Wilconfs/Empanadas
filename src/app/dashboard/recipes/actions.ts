// src/app/dashboard/recipes/actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProductWithRecipe(formData: FormData, ingredientsData: { ingredientId: number, quantity: number }[]) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);

    // Creamos el producto y sus relaciones en la tabla RecipeItem de forma atómica
    await prisma.product.create({
      data: {
        name,
        price,
        recipe: {
          create: ingredientsData.map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity
          }))
        }
      }
    });

    revalidatePath('/dashboard/recipes');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error al crear la receta:", error);
    return { success: false, error: "No se pudo registrar la receta y el producto." };
  }
}

export async function deleteProduct(id: number) {
  try {
    // Primero eliminamos los items de la receta vinculados para evitar conflictos de llave foránea
    await prisma.recipeItem.deleteMany({
      where: { productId: id }
    });

    // Luego eliminamos el producto
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath('/dashboard/recipes');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la receta:", error);
    return { success: false, error: "No se pudo eliminar el producto." };
  }
}