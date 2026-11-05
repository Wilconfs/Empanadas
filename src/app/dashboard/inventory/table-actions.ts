// src/app/dashboard/inventory/table-actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateIngredient(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const unit = formData.get("unit") as string;
    const costPerUnit = parseFloat(formData.get("costPerUnit") as string);
    const currentStock = parseFloat(formData.get("currentStock") as string);

    await prisma.ingredient.update({
      where: { id },
      data: { name, unit, costPerUnit, currentStock }
    });

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar:", error);
    return { success: false, error: "No se pudo actualizar el insumo." };
  }
}

export async function deleteIngredient(id: number) {
  try {
    await prisma.ingredient.delete({
      where: { id }
    });

    revalidatePath('/dashboard/inventory');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return { success: false, error: "No se pudo eliminar (puede estar en uso en alguna receta)." };
  }
}