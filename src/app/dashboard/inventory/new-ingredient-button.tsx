// src/app/dashboard/inventory/new-ingredient-button.tsx
"use client"

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createIngredient } from "./actions";

export default function NewIngredientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await createIngredient(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setIsOpen(false);
      // Limpiar formulario o recargar si es necesario
      event.currentTarget.reset();
    } else {
      alert(result.error);
    }
  }

  return (
    <>
      {/* Botón Principal Azul Neón */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 shrink-0"
      >
        <Plus size={18} />
        <span>Nuevo Insumo</span>
      </button>

      {/* Ventana Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#090D16]">
              <h3 className="text-lg font-bold text-white">Registrar Nuevo Insumo</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Nombre (Ej. Salsa de Ajo)</label>
                <input 
                  required 
                  name="name" 
                  type="text" 
                  className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Unidad (gramos, ml, ud)</label>
                  <input 
                    required 
                    name="unit" 
                    type="text" 
                    placeholder="Ej. gramos"
                    className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Stock Inicial</label>
                  <input 
                    required 
                    name="currentStock" 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Costo por Unidad ($)</label>
                <input 
                  required 
                  name="costPerUnit" 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="Costo de 1 solo gramo o unidad"
                  className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 bg-[#090D16] border border-gray-800 text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Insumo"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}