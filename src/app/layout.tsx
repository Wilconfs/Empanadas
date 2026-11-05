// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Empanadas",
  description: "Dashboard de costos e inventario",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Agregamos className="dark" para forzar el modo oscuro permanentemente
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        {children}
      </body>
    </html>
  );
}