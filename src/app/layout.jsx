import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "../lib/providers/react-query-provider";
import { AuthProvider } from "../lib/providers/auth-provider";
import { AuthInitializer } from '../lib/providers/AuthInitializer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Finanzas Personales",
  description: "Gestiona tus ingresos, gastos y genera reportes visuales",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <AuthProvider>
            <AuthInitializer />
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
} 