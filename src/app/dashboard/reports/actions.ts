// src/app/dashboard/reports/actions.ts
"use server"

import { prisma } from "@/lib/prisma";

export async function getSalesReport() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return sales;
  } catch (error) {
    console.error("Error al obtener reporte de ventas:", error);
    return [];
  }
}