// src/app/dashboard/inventory/ingredient-row-actions.tsx
"use client"

import { useState } from "react";
import { Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { updateIngredient, deleteIngredient } from "./table-actions";

type Ingredient = {
  id: number;
  name: string;
  unit: string;
  costPerUnit: number;
  currentStock: number;
};

export default function IngredientRowActions({ ingredient }: { ingredient: Ingredient }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateIngredient(ingredient.id, formData);
    setIsSubmitting(false);
    if (res.success) {
      setIsEditOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDeleteConfirm() {
    setIsSubmitting(true);
    const res = await deleteIngredient(ingredient.id);
    setIsSubmitting(false);
    if (res.success) {
      setIsDeleteOpen(false);
    } else {
      alert(res.error);
      setIsDeleteOpen(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Botón Editar */}
      <button 
        onClick={() => setIsEditOpen(true)}
        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
        title="Editar insumo"
      >
        <Edit size={16} />
      </button>

      {/* Botón Eliminar */}
      <button 
        onClick={() => setIsDeleteOpen(true)}
        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
        title="Eliminar insumo"
      >
        <Trash2 size={16} />
      </button>

      {/* Modal de Edición */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-left">
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#090D16]">
              <h3 className="text-lg font-bold text-white">Editar Insumo</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Nombre</label>
                <input 
                  required 
                  name="name" 
                  defaultValue={ingredient.name}
                  className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Unidad</label>
                  <input 
                    required 
                    name="unit" 
                    defaultValue={ingredient.unit}
                    className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Stock Actual</label>
                  <input 
                    required 
                    name="currentStock" 
                    type="number" 
                    step="0.01"
                    defaultValue={ingredient.currentStock}
                    className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Costo Unitario ($)</label>
                <input 
                  required 
                  name="costPerUnit" 
                  type="number" 
                  step="0.01"
                  defaultValue={ingredient.costPerUnit}
                  className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3 bg-[#090D16] border border-gray-800 text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                >
                  {isSubmitting ? "Guardando..." : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación Personalizado */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#0D1322] border border-gray-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden text-center p-6">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">¿Eliminar insumo?</h3>
            <p className="text-xs text-gray-400 mb-6 px-2">
              Estás a punto de eliminar <span className="text-white font-semibold">"{ingredient.name}"</span>. Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsDeleteOpen(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-[#090D16] border border-gray-800 text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {isSubmitting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}