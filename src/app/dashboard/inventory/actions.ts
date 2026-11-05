// src/app/dashboard/inventory/actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createIngredient(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const unit = formData.get("unit") as string;
    const costPerUnit = parseFloat(formData.get("costPerUnit") as string);
    const currentStock = parseFloat(formData.get("currentStock") as string);

    // Crea el insumo en MySQL
    await prisma.ingredient.create({
      data: {
        name,
        unit,
        costPerUnit,
        currentStock,
      }
    });

    // Refresca la página de inventario en tiempo real
    revalidatePath('/dashboard/inventory');
    
    return { success: true };
  } catch (error) {
    console.error("Error al crear el insumo:", error);
    return { success: false, error: "Hubo un problema al guardar el insumo en la base de datos." };
  }
}