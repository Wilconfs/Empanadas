// src/app/dashboard/reports/print-button.tsx
"use client"

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/30"
    >
      <Printer size={15} />
      <span>Imprimir</span>
    </button>
  );
}