// src/app/dashboard/recipes/page.tsx
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Receipt, ChefHat, Trash2 } from "lucide-react";
import NewRecipeModal from "./new-recipe-modal";
import { deleteProduct } from "./actions";

async function RecipesContent() {
  const products = await prisma.product.findMany({
    include: {
      recipe: {
        include: {
          ingredient: true
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => {
          const totalCost = product.recipe.reduce((acc, item) => acc + (item.quantity * item.ingredient.costPerUnit), 0);
          const profit = product.price - totalCost;
          const margin = product.price > 0 ? (profit / product.price) * 100 : 0;

          return (
            <div key={product.id} className="bg-[#0D1322] rounded-2xl p-6 border border-gray-800/80 shadow-lg relative overflow-hidden flex flex-col justify-between group hover:border-blue-500/50 transition-all">
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-bl-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
              
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <form action={async () => {
                    "use server";
                    await deleteProduct(product.id);
                  }}>
                    <button type="submit" className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors" title="Eliminar receta">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Precio Venta:</span>
                    <span className="font-bold text-white">${product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Costo Producción:</span>
                    <span className="font-bold text-rose-400">${totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Margen de Ganancia:</span>
                    <span className="font-bold text-emerald-400">{margin.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Ingredientes de la Receta */}
                <div className="border-t border-gray-800/80 pt-3">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredientes Requeridos:</h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                    {product.recipe.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs bg-[#090D16] px-3 py-1.5 rounded-lg border border-gray-800/60">
                        <span className="text-gray-200 font-medium">{item.ingredient.name}</span>
                        <span className="text-gray-400">{item.quantity} {item.ingredient.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-800/80 flex justify-between items-center">
                <span className="text-xs text-gray-500">Utilidad Unitaria</span>
                <span className="text-sm font-bold text-emerald-400">+${profit.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0D1322] rounded-2xl border border-dashed border-gray-800">
          <ChefHat size={40} className="text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm">No hay recetas registradas en el sistema.</p>
        </div>
      )}

      {/* Botón flotante del modal */}
      <div className="fixed bottom-6 right-6 z-30">
        <NewRecipeModal ingredients={ingredients} />
      </div>
    </div>
  );
}

export default function RecipesPage() {
  return (
    <div className="w-full h-full flex flex-col min-h-0 max-w-[1700px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Gestión de Recetas</h1>
          <p className="text-xs md:text-sm text-gray-400">Configura la composición de insumos y costos por producto</p>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Cargando recetas...</p>
        </div>
      }>
        <RecipesContent />
      </Suspense>
    </div>
  );
}