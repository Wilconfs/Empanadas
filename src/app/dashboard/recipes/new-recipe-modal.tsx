// src/app/dashboard/recipes/new-recipe-modal.tsx
"use client"

import { useState } from "react";
import { Plus, X, Trash2, ChefHat } from "lucide-react";
import { createProductWithRecipe } from "./actions";

type Ingredient = { id: number; name: string; unit: string; costPerUnit: number };
type RecipeItemInput = { ingredientId: number; quantity: number; name: string; unit: string; cost: number };

export default function NewRecipeModal({ ingredients }: { ingredients: Ingredient[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedIngredients, setSelectedIngredients] = useState<RecipeItemInput[]>([]);
  const [currentIngId, setCurrentIngId] = useState<number | "">("");
  const [currentQty, setCurrentQty] = useState("");

  const addIngredientToRecipe = () => {
    if (currentIngId === "" || !currentQty || parseFloat(currentQty) <= 0) return;
    const ing = ingredients.find(i => i.id === Number(currentIngId));
    if (!ing) return;

    // Verificar si ya está agregado
    if (selectedIngredients.some(item => item.ingredientId === ing.id)) {
      alert("Este ingrediente ya está agregado en la receta.");
      return;
    }

    setSelectedIngredients([
      ...selectedIngredients,
      {
        ingredientId: ing.id,
        quantity: parseFloat(currentQty),
        name: ing.name,
        unit: ing.unit,
        cost: ing.costPerUnit
      }
    ]);

    setCurrentIngId("");
    setCurrentQty("");
  };

  const removeRecipeItem = (id: number) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.ingredientId !== id));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedIngredients.length === 0) {
      alert("Debes agregar al menos un ingrediente a la receta.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = selectedIngredients.map(i => ({ ingredientId: i.ingredientId, quantity: i.quantity }));

    const res = await createProductWithRecipe(formData, payload);
    setIsSubmitting(false);

    if (res.success) {
      setIsOpen(false);
      setSelectedIngredients([]);
      e.currentTarget.reset();
    } else {
      alert(res.error);
    }
  }

  // Calcular costo de producción estimado en tiempo real dentro del modal
  const estimatedCost = selectedIngredients.reduce((acc, item) => acc + (item.quantity * item.cost), 0);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 shrink-0"
      >
        <Plus size={18} />
        <span>Nueva Receta</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D1322] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-left my-8">
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#090D16]">
              <div className="flex items-center gap-2">
                <ChefHat className="text-blue-400" size={20} />
                <h3 className="text-lg font-bold text-white">Crear Nueva Receta</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Nombre del Producto</label>
                  <input 
                    required 
                    name="name" 
                    placeholder="Ej. Empanada de Pollo"
                    className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Precio de Venta al Público ($)</label>
                  <input 
                    required 
                    name="price" 
                    type="number" 
                    step="50"
                    placeholder="Ej. 4000"
                    className="w-full bg-[#090D16] border border-gray-800 text-gray-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Selector de Ingredientes para la Receta */}
              <div className="bg-[#090D16] p-4 rounded-xl border border-gray-800/80 space-y-3">
                <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider">Composición de Insumos</label>
                
                <div className="flex gap-2">
                  <select 
                    value={currentIngId}
                    onChange={(e) => setCurrentIngId(e.target.value === "" ? "" : Number(e.target.value))}
                    className="flex-1 bg-[#0D1322] border border-gray-800 text-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seleccionar insumo...</option>
                    {ingredients.map(ing => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.unit}) - ${ing.costPerUnit}/{ing.unit}
                      </option>
                    ))}
                  </select>

                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Cantidad"
                    value={currentQty}
                    onChange={(e) => setCurrentQty(e.target.value)}
                    className="w-24 bg-[#0D1322] border border-gray-800 text-gray-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500"
                  />

                  <button 
                    type="button"
                    onClick={addIngredientToRecipe}
                    className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-blue-600/30"
                  >
                    Añadir
                  </button>
                </div>

                {/* Lista de ingredientes agregados */}
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pt-2">
                  {selectedIngredients.map((item) => (
                    <div key={item.ingredientId} className="flex justify-between items-center bg-[#0D1322] px-3 py-2 rounded-lg border border-gray-800">
                      <div>
                        <span className="text-xs font-bold text-gray-200">{item.name}</span>
                        <span className="text-[11px] text-gray-400 ml-2">({item.quantity} {item.unit})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-emerald-400">${(item.quantity * item.cost).toLocaleString()}</span>
                        <button type="button" onClick={() => removeRecipeItem(item.ingredientId)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedIngredients.length === 0 && (
                    <p className="text-center text-xs text-gray-500 py-3">Aún no hay ingredientes en esta receta.</p>
                  )}
                </div>

                {selectedIngredients.length > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-800 text-xs">
                    <span className="text-gray-400 font-medium">Costo de Producción Estimado:</span>
                    <span className="font-bold text-rose-400">${estimatedCost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 bg-[#090D16] border border-gray-800 text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || selectedIngredients.length === 0}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Crear Receta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}