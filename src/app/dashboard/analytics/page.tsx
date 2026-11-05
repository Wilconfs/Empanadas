// src/app/dashboard/analytics/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PieChart, TrendingUp, DollarSign, ShoppingBag, Trash2, Calendar } from "lucide-react";
import { deleteSale } from "./actions";

async function AnalyticsContent() {
  // Traemos todas las ventas con sus items y productos
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

  // 1. Calcular totales y métricas por método de pago
  let totalRevenue = 0;
  const paymentMethodStats: { [key: string]: number } = {};
  const productSalesCount: { [key: string]: number } = {};

  sales.forEach(sale => {
    totalRevenue += sale.total;
    
    // Conteo por método de pago
    const method = sale.paymentMethod || "Efectivo";
    paymentMethodStats[method] = (paymentMethodStats[method] || 0) + sale.total;

    // Conteo de productos más vendidos
    sale.items.forEach(item => {
      const prodName = item.product.name;
      productSalesCount[prodName] = (productSalesCount[prodName] || 0) + item.quantity;
    });
  });

  return (
    <div className="space-y-6">
      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <DollarSign size={22} />
            </div>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md">Ingresos</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Ventas Acumuladas</h4>
          <h2 className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <ShoppingBag size={22} />
            </div>
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md">Tickets</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total de Ventas</h4>
          <h2 className="text-2xl font-bold text-white mt-1">{sales.length} <span className="text-xs font-normal text-gray-500">transacciones</span></h2>
        </div>

        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-600/10 text-emerald-400 rounded-xl">
              <TrendingUp size={22} />
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">Rendimiento</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Promedio por Ticket</h4>
          <h2 className="text-2xl font-bold text-emerald-400 mt-1">
            ${sales.length > 0 ? Math.round(totalRevenue / sales.length).toLocaleString() : 0}
          </h2>
        </div>
      </div>

      {/* Sección de Desglose y Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Desglose por Método de Pago */}
        <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Ventas por Método de Pago</h3>
          <div className="space-y-4">
            {Object.keys(paymentMethodStats).length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No hay registros de pagos aún.</p>
            ) : (
              Object.entries(paymentMethodStats).map(([method, amount]) => {
                const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                return (
                  <div key={method} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-300">{method}</span>
                      <span className="text-blue-400">${amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Ranking de Productos Más Vendidos */}
        <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4">Empanadas Más Vendidas</h3>
          <div className="space-y-3">
            {Object.keys(productSalesCount).length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No hay productos vendidos todavía.</p>
            ) : (
              Object.entries(productSalesCount).map(([productName, qty]) => (
                <div key={productName} className="flex justify-between items-center bg-[#090D16] px-4 py-3 rounded-xl border border-gray-800/60">
                  <span className="text-xs font-bold text-gray-200">{productName}</span>
                  <span className="text-xs font-extrabold bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/30">
                    {qty} unidades
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Historial Detallado de Transacciones */}
      <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800 bg-[#090D16] flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Historial de Tickets Recientes</h3>
          <span className="text-xs text-gray-400">{sales.length} registros totales</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#0D1322] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">ID Ticket</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Detalle / Productos</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-xs">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-[#131B2E] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-400">#{sale.id}</td>
                  <td className="py-3.5 px-4 text-gray-300">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-blue-500/10 text-blue-400 font-bold px-2.5 py-1 rounded-lg border border-blue-500/20">
                      {sale.paymentMethod || "Efectivo"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">
                    {sale.items.map(i => `${i.quantity}x ${i.product.name}`).join(", ")}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                    ${sale.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <form action={async () => {
                      "use server";
                      await deleteSale(sale.id);
                    }}>
                      <button 
                        type="submit" 
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                        title="Eliminar registro"
                      >
                        <Trash2 size={15} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}

              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No hay transacciones registradas en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0 max-w-[1700px] mx-auto pb-10">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Analytics y Reportes</h1>
        <p className="text-xs md:text-sm text-gray-400">Métricas avanzadas, métodos de pago e historial de ventas</p>
      </div>

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Cargando analíticas...</p>
        </div>
      }>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}