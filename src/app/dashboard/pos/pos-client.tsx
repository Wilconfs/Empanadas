// src/app/dashboard/pos/pos-client.tsx
"use client"

import { useState, useEffect } from "react";
import { Plus, Minus, Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { registerSale } from "./actions";

type Product = { id: number; name: string; price: number };
type CartItem = Product & { quantity: number; subtotal: number };

export default function PosClient({ products }: { products: Product[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("Efectivo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Evita el error de hidratación asegurando que solo se renderice en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, subtotal: product.price }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity, subtotal: newQuantity * item.price };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    const formattedCart = cart.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const result = await registerSale(formattedCart, total, paymentMethod);
    
    setIsProcessing(false);
    if (result.success) {
      setCart([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
      
      {/* Panel Izquierdo: Menú Rápido */}
      <div className="flex-1 flex flex-col bg-[#0D1322] border border-gray-800/80 rounded-2xl p-5 overflow-hidden shadow-xl">
        <h2 className="text-base md:text-lg font-bold text-white mb-4 shrink-0">Menú Rápido</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pr-1">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-[#090D16] border border-gray-800/80 p-4 rounded-xl text-left hover:border-blue-500 hover:bg-blue-600/5 transition-all active:scale-95 flex flex-col justify-between h-32 group shadow-sm"
              >
                <span className="font-semibold text-gray-200 text-sm md:text-base line-clamp-2 group-hover:text-blue-400 transition-colors">{product.name}</span>
                <span className="text-blue-400 font-bold text-sm md:text-base mt-2">${product.price.toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Derecho: Ticket de Venta */}
      <div className="w-full lg:w-96 flex flex-col bg-[#0D1322] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl shrink-0">
        <div className="p-4 border-b border-gray-800/80 bg-[#090D16] flex justify-between items-center shrink-0">
          <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-400"/> Ticket actual
          </h2>
          {cart.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md shadow-blue-600/30">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} items
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar bg-[#0D1322] max-h-56 lg:max-h-none">
          {cart.length === 0 ? (
            <div className="h-32 lg:h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingBag size={36} className="mb-2 opacity-20" />
              <p className="text-xs">Sin productos seleccionados</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-[#090D16] p-3 rounded-xl border border-gray-800/80">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs md:text-sm font-bold text-gray-200 truncate">{item.name}</p>
                  <p className="text-xs text-blue-400">${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-[#0D1322] rounded-lg border border-gray-700">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 text-gray-400 hover:text-white"><Minus size={14}/></button>
                    <span className="w-5 text-center text-xs font-bold text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 text-gray-400 hover:text-white"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sección de Selección de Método de Pago */}
        <div className="p-4 bg-[#090D16] border-t border-gray-800/80 shrink-0 space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {["Efectivo", "Nequi", "Davivienda"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    paymentMethod === method
                      ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm"
                      : "bg-[#0D1322] border-gray-800 text-gray-400 hover:border-gray-700"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-800/60">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total a cobrar</span>
            <span className="text-xl md:text-2xl font-bold text-white">${total.toLocaleString()}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className={`w-full py-3.5 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all ${
              showSuccess 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                : cart.length === 0 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/30 active:scale-[0.98]"
            }`}
          >
            {showSuccess ? (
              <><CheckCircle size={20} /> ¡Venta Exitosa!</>
            ) : isProcessing ? (
              "Procesando..."
            ) : (
              `Cobrar con ${paymentMethod}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}