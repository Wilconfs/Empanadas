// src/app/dashboard/settings/page.tsx
import { Suspense } from "react";
import { Store, Smartphone, Shield, CreditCard } from "lucide-react";
import { getPaymentMethods, togglePaymentMethod, addPaymentMethod } from "./actions";

async function SettingsContent() {
  const paymentMethods = await getPaymentMethods();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Columna Principal: Ajustes y Métodos de Pago */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Sección de Datos Generales */}
        <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-800/80">
            <div className="p-2.5 bg-blue-600/10 text-blue-400 rounded-xl">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Datos del Establecimiento</h2>
              <p className="text-xs text-gray-400">Información general de tu operación</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Nombre del Negocio</label>
              <input 
                type="text" 
                defaultValue="Empanadas Pro"
                disabled
                className="w-full bg-[#090D16] border border-gray-800 text-gray-300 text-sm rounded-xl px-4 py-3 opacity-80 cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Celular / Cuenta Principal</label>
                <input 
                  type="text" 
                  defaultValue="300 123 4567"
                  disabled
                  className="w-full bg-[#090D16] border border-gray-800 text-gray-300 text-sm rounded-xl px-4 py-3 opacity-80 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Ubicación</label>
                <input 
                  type="text" 
                  defaultValue="Bogotá, Colombia"
                  disabled
                  className="w-full bg-[#090D16] border border-gray-800 text-gray-300 text-sm rounded-xl px-4 py-3 opacity-80 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Gestión de Métodos de Pago */}
        <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-800/80">
            <div className="p-2.5 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <CreditCard size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Métodos de Pago en el POS</h2>
              <p className="text-xs text-gray-400">Activa o deshabilita los métodos disponibles al cobrar</p>
            </div>
          </div>

          {/* Listado de métodos actuales */}
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between bg-[#090D16] px-4 py-3 rounded-xl border border-gray-800/80">
                <span className="text-sm font-bold text-gray-200">{method.name}</span>
                
                <form action={async () => {
                  "use server";
                  await togglePaymentMethod(method.id, !method.active);
                }}>
                  <button 
                    type="submit"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      method.active 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }`}
                  >
                    {method.active ? "Activo" : "Inactivo"}
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Formulario para agregar nuevo método */}
          <form action={async (formData: FormData) => {
            "use server";
            const name = formData.get("methodName") as string;
            if (name) await addPaymentMethod(name);
          }} className="flex gap-3 pt-4 border-t border-gray-800/80">
            <input 
              required
              name="methodName"
              placeholder="Nuevo método (Ej. Bancolombia, D1...)"
              className="flex-1 bg-[#090D16] border border-gray-800 text-gray-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-blue-600/30"
            >
              Agregar
            </button>
          </form>
        </div>

      </div>

      {/* Columna Lateral de Sistema */}
      <div className="space-y-6">
        <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-800/80">
            <div className="p-2.5 bg-cyan-600/10 text-cyan-400 rounded-xl">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Seguridad y Datos</h3>
              <p className="text-xs text-gray-400">Estado del sistema local</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex justify-between py-2 border-b border-gray-800/60">
              <span className="text-gray-400">Base de Datos</span>
              <span className="font-bold text-emerald-400">MySQL (Local)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800/60">
              <span className="text-gray-400">Framework</span>
              <span className="font-bold text-white">Next.js 16</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">ORM</span>
              <span className="font-bold text-white">Prisma v6</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0D1322] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Modo de Operación</h4>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Los cambios que realices en los métodos de pago se sincronizan al instante con el módulo del Punto de Venta (POS).
          </p>
          <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-medium">
            🟢 Sincronizado y activo
          </div>
        </div>
      </div>

    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0 max-w-[1700px] mx-auto pb-10">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Configuración del Negocio</h1>
        <p className="text-xs md:text-sm text-gray-400">Ajusta los parámetros generales y métodos de pago</p>
      </div>

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Cargando configuración...</p>
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </div>
  );
}