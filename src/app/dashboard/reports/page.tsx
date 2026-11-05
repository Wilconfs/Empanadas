// src/app/dashboard/reports/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FileText, DollarSign } from "lucide-react";
import PrintButton from "./print-button"; // Importamos el componente cliente externo

async function ReportsContent() {
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

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalItemsSold = sales.reduce((acc, sale) => {
    return acc + sale.items.reduce((itemAcc, i) => itemAcc + i.quantity, 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Tarjetas de Resumen para Reporte */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600/10 text-blue-400 rounded-xl">
              <DollarSign size={22} />
            </div>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md">Total Caja</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Recaudo Consolidado</h4>
          <h2 className="text-2xl font-bold text-white mt-1">${totalRevenue.toLocaleString()}</h2>
        </div>

        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <FileText size={22} />
            </div>
            <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md">Volumen</span>
          </div>
          <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Empanadas Despachadas</h4>
          <h2 className="text-2xl font-bold text-white mt-1">{totalItemsSold} <span className="text-xs font-normal text-gray-500">unidades</span></h2>
        </div>

        <div className="bg-[#0D1322] p-6 rounded-2xl border border-gray-800/80 shadow-lg flex flex-col justify-between">
          <div>
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Acciones de Auditoría</h4>
            <p className="text-xs text-gray-500">Imprime o exporta el corte de caja actual.</p>
          </div>
          <div className="flex gap-2 mt-4">
            <PrintButton />
          </div>
        </div>
      </div>

      {/* Tabla Oficial de Auditoría de Caja */}
      <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Corte de Caja y Auditoría</h3>
            <p className="text-xs text-gray-400">Detalle formal de transacciones para control administrativo</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
            🟢 Estado: Cuadrado
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-[#0D1322] text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Fecha y Hora</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Descripción de Productos</th>
                <th className="py-3 px-4 text-right">Valor Recaudado</th>
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
                </tr>
              ))}

              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No hay registros en el reporte de caja.
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

export default function ReportsPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0 max-w-[1700px] mx-auto pb-10">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Reportes y Auditoría</h1>
        <p className="text-xs md:text-sm text-gray-400">Corte de caja formal e historial exportable</p>
      </div>

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Generando reporte de caja...</p>
        </div>
      }>
        <ReportsContent />
      </Suspense>
    </div>
  );
}