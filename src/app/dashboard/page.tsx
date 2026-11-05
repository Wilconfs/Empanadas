// src/app/dashboard/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Calendar, Filter, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, Activity } from "lucide-react";

async function DashboardContent() {
  const products = await prisma.product.findMany({
    include: { recipe: { include: { ingredient: true } } },
  });

  const sales = await prisma.sale.findMany({
    include: {
      items: {
        include: {
          product: {
            include: { recipe: { include: { ingredient: true } } }
          }
        }
      }
    }
  });

  let totalRevenue = 0;
  let totalCostOfSales = 0;

  sales.forEach(sale => {
    totalRevenue += sale.total;
    sale.items.forEach(item => {
      const unitCost = item.product.recipe.reduce((acc, recipeItem) => {
        return acc + (recipeItem.quantity * recipeItem.ingredient.costPerUnit);
      }, 0);
      totalCostOfSales += (unitCost * item.quantity);
    });
  });

  const netProfit = totalRevenue - totalCostOfSales;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda / Central: Métricas y Cuadrícula */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Tarjetas Superiores (KPIs) Azules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400">
                <ShoppingBag size={22} />
              </div>
              <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Stock</span>
            </div>
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Tipos de Empanadas</h4>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-2xl font-bold text-white">{products.length}</h2>
              <span className="text-xs font-medium text-emerald-400 mb-0.5">Activas</span>
            </div>
          </div>

          <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-600/10 rounded-xl text-cyan-400">
                <DollarSign size={22} />
              </div>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">{sales.length} tickets</span>
            </div>
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Ventas Totales</h4>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</h2>
            </div>
          </div>

          <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-400">
                <TrendingUp size={22} />
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">+Utilidad</span>
            </div>
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Ganancia Neta</h4>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-2xl font-bold text-emerald-400">${netProfit.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        {/* Sección de Análisis de Costos */}
        <div>
          <div className="mb-5 flex justify-between items-end">
            <div>
              <h3 className="text-lg font-bold text-white">Análisis de Costos y Recetas</h3>
              <p className="text-xs text-gray-400">Rentabilidad individual en tiempo real</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#0D1322] rounded-2xl border border-dashed border-gray-800">
              <p className="text-gray-400 text-sm">Aún no hay empanadas registradas en el sistema.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => {
                const totalCost = product.recipe.reduce((acc, item) => acc + item.quantity * item.ingredient.costPerUnit, 0);
                const profit = product.price - totalCost;
                const margin = product.price > 0 ? (profit / product.price) * 100 : 0;

                return (
                  <div key={product.id} className="bg-[#0D1322] rounded-2xl p-6 border border-gray-800/80 hover:border-blue-500/50 transition-all shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-bl-full -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                    <h3 className="text-base font-bold text-white mb-4">{product.name}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-gray-800/60 pb-2.5">
                        <span className="text-gray-400">Precio Venta</span>
                        <span className="font-bold text-white">${product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-b border-gray-800/60 pb-2.5">
                        <span className="text-gray-400">Costo Producción</span>
                        <span className="font-bold text-rose-400">${totalCost.toLocaleString()}</span>
                      </div>
                      
                      <div className="pt-1 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-gray-400 block">Ganancia Neta</span>
                          <span className="text-base font-bold text-emerald-400">${profit.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 block">Margen</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            margin >= 40 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {margin.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Columna Derecha: Panel Lateral tipo Widget (Estilo referencia) */}
      <div className="space-y-6">
        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Meta Diaria</h4>
            <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-lg">Calle</span>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-gray-800 bg-[#090D16]">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-slow"></div>
              <div className="text-center">
                <span className="text-2xl font-bold text-white">65%</span>
                <span className="text-[10px] text-gray-400 block">Completado</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-4 pt-4 border-t border-gray-800/80 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Ventas Objetivo</span>
              <span className="font-bold text-white">$150.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Progreso Actual</span>
              <span className="font-bold text-emerald-400">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Widget Estado del Sistema */}
        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Activity size={20} />
            </div>
            <div>
              <h5 className="text-sm font-bold text-white">Sistema Activo</h5>
              <p className="text-xs text-gray-400">Next.js & Prisma ORM</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Los datos de costos, inventario y POS están sincronizados de forma centralizada con la base de datos local.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-[1700px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Resumen de Operación</h1>
          <p className="text-xs md:text-sm text-gray-400">Métricas de tus ventas en la calle</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D1322] border border-gray-800 rounded-xl text-xs md:text-sm text-gray-300 hover:border-blue-500 transition-colors shadow-sm">
            <Calendar size={16} className="text-blue-400" />
            <span>Histórico</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0D1322] border border-gray-800 rounded-xl text-xs md:text-sm text-gray-300 hover:border-blue-500 transition-colors shadow-sm">
            <Filter size={16} className="text-blue-400" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-20 text-gray-500 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Cargando panel analítico...</span>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}