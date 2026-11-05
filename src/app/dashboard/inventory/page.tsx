// src/app/dashboard/inventory/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Package, DollarSign, AlertCircle } from "lucide-react";
import NewIngredientButton from "./new-ingredient-button";
import IngredientRowActions from "./ingredient-row-actions";

async function InventoryContent() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  });

  const totalInventoryValue = ingredients.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
  const lowStockItems = ingredients.filter(item => item.currentStock <= 50).length;

  return (
    <>
      {/* Tarjetas de Resumen (KPIs) Azules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 shrink-0">
        <div className="bg-[#0D1322] p-5 rounded-2xl border border-gray-800/80 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Capital en Inventario</p>
            <h3 className="text-2xl font-bold text-white">${totalInventoryValue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-[#0D1322] p-5 rounded-2xl border border-gray-800/80 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-rose-600/10 rounded-xl text-rose-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Insumos por Agotarse</p>
            <h3 className="text-2xl font-bold text-white">
              {lowStockItems} <span className="text-xs font-normal text-gray-500">alertas</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Tabla Estilo Neón Azul */}
      <div className="flex-1 bg-[#0D1322] border border-gray-800/80 rounded-2xl flex flex-col min-h-0 overflow-hidden shadow-xl">
        <div className="p-4 md:p-5 border-b border-gray-800 bg-[#090D16] flex items-center gap-2.5 shrink-0">
          <Package size={18} className="text-blue-400" />
          <h2 className="text-base md:text-lg font-bold text-white">Control de Materia Prima</h2>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#0D1322] sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 border-b border-gray-800">Insumo</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 border-b border-gray-800">Costo Unitario</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 border-b border-gray-800">Stock Actual</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 border-b border-gray-800">Valor Total</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 border-b border-gray-800 text-right">Estado</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 border-b border-gray-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {ingredients.map((item) => {
                const totalValue = item.currentStock * item.costPerUnit;
                const isLowStock = item.currentStock <= 50;

                return (
                  <tr key={item.id} className="hover:bg-[#131B2E] transition-colors group">
                    <td className="py-3 px-4">
                      <p className="text-sm font-bold text-gray-200 group-hover:text-blue-400 transition-colors">{item.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-300">${item.costPerUnit.toLocaleString()} <span className="text-xs text-gray-500">/ {item.unit}</span></p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-bold text-white">{item.currentStock.toLocaleString()}</span> <span className="text-xs text-gray-500">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-bold text-emerald-400">${totalValue.toLocaleString()}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                          <AlertCircle size={12} /> Bajo
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg">
                          Óptimo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <IngredientRowActions ingredient={item} />
                    </td>
                  </tr>
                );
              })}
              
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No hay insumos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function InventoryPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0 max-w-[1700px] mx-auto pb-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Inventario de Insumos</h1>
          <p className="text-xs md:text-sm text-gray-400">Control de materia prima y costos en tiempo real</p>
        </div>
        
        <NewIngredientButton />
      </div>

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Cargando inventario...</p>
        </div>
      }>
        <InventoryContent />
      </Suspense>
    </div>
  );
}