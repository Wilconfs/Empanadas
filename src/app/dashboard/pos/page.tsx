// src/app/dashboard/pos/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PosClient from "./pos-client";

// 1. Componente asíncrono que consulta la base de datos
async function PosContent() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, price: true }
  });

  return <PosClient products={products} />;
}

// 2. Página principal que envuelve el contenido en Suspense
export default function PosPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0 max-w-[1600px] mx-auto">
      <div className="mb-4 md:mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Punto de Venta</h1>
        <p className="text-xs md:text-sm text-gray-400">Registra ventas al instante</p>
      </div>
      
      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3 bg-[#161925] border border-gray-800 rounded-2xl">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Cargando menú de empanadas...</p>
        </div>
      }>
        <PosContent />
      </Suspense>
    </div>
  );
}