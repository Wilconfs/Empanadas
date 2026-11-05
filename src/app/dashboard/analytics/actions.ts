// src/app/dashboard/analytics/actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSale(saleId: number) {
  try {
    // Eliminamos los items asociados primero por restricciones de llave foránea
    await prisma.saleItem.deleteMany({
      where: { saleId }
    });

    // Luego eliminamos la venta
    await prisma.sale.delete({
      where: { id: saleId }
    });

    revalidatePath('/dashboard/analytics');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    return { success: false, error: "No se pudo eliminar el registro de venta." };
  }
}