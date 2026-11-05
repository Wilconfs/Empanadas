// src/app/dashboard/settings/actions.ts
"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPaymentMethods() {
  try {
    // Si no existen métodos creados, inicializamos los por defecto
    const count = await prisma.paymentMethod.count();
    if (count === 0) {
      await prisma.paymentMethod.createMany({
        data: [
          { name: "Efectivo", active: true },
          { name: "Nequi", active: true },
          { name: "Davivienda", active: true }
        ]
      });
    }
    return await prisma.paymentMethod.findMany({ orderBy: { id: 'asc' } });
  } catch (error) {
    console.error("Error al obtener métodos de pago:", error);
    return [];
  }
}

export async function togglePaymentMethod(id: number, active: boolean) {
  try {
    await prisma.paymentMethod.update({
      where: { id },
      data: { active }
    });
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/pos');
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar método:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}

export async function addPaymentMethod(name: string) {
  try {
    await prisma.paymentMethod.create({
      data: { name, active: true }
    });
    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard/pos');
    return { success: true };
  } catch (error) {
    console.error("Error al crear método:", error);
    return { success: false, error: "El método ya existe o no se pudo crear." };
  }
}