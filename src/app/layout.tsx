import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Ops Dashboard - Monitoreo Operativo",
  description: "Módulo de monitoreo operativo en tiempo real",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 min-h-screen text-gray-100">
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px', background: '#1f2937', color: '#f3f4f6' } }} />
          <NavBar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
