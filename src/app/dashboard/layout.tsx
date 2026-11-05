// src/app/dashboard/layout.tsx
"use client"
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, ShoppingCart, Receipt, 
  Settings, PieChart, MessageSquare, 
  Search, Bell, User, Zap, Menu, X
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuSections = [
    {
      title: "MENU",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Analytics", icon: PieChart, path: "/dashboard/analytics" },
        { name: "Recetas", icon: Receipt, path: "/dashboard/recipes" },
        { name: "Inventario", icon: Package, path: "/dashboard/inventory" },
        { name: "Punto de Venta", icon: ShoppingCart, path: "/dashboard/pos" },
      ]
    },
    {
      title: "ACCOUNT",
      items: [
        { name: "Reportes", icon: MessageSquare, path: "/dashboard/reports" },
        { name: "Configuración", icon: Settings, path: "/dashboard/settings" },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#090D16] text-gray-100 font-sans">
      
      {/* Fondo oscuro al abrir menú móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Azul Neón */}
      <aside className={`absolute md:relative w-64 h-full flex flex-col bg-[#0D1322] border-r border-gray-800/80 shadow-2xl z-50 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="h-20 flex items-center justify-between md:justify-center px-6 border-b border-gray-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide text-white">
              Empanadas <span className="text-blue-400">Pro</span>
            </span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
          {menuSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-bold text-gray-500 mb-3 tracking-wider px-3">{section.title}</h4>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30"
                          : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
                      }`}
                    >
                      <item.icon size={20} className={isActive ? "text-white" : "text-gray-400"} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Tarjeta inferior tipo widget */}
        <div className="p-4 m-4 bg-[#131B2E] rounded-2xl border border-gray-800/80 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>
          <h5 className="text-xs font-bold text-white mb-1">Estado de Caja</h5>
          <p className="text-[11px] text-blue-400 font-medium mb-3">Conectado a MySQL</p>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-3/4 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 md:h-20 bg-[#0D1322]/80 backdrop-blur-md border-b border-gray-800/80 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="md:hidden text-gray-400 hover:text-white p-1" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar productos, recetas..." 
                className="w-full bg-[#090D16] border border-gray-800 text-sm text-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <button className="relative text-gray-400 hover:text-white transition-colors p-2 bg-[#131B2E] rounded-xl border border-gray-800 hidden sm:block">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-0 sm:pl-6 border-none sm:border-l border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-200">Admin</p>
                <p className="text-[10px] text-gray-400">admin@empanadas.com</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
                <User size={18} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main dinámico */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}