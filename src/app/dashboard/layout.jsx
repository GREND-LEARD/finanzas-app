'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth-store';
import Link from 'next/link';
import { 
  FaChartLine, 
  FaExchangeAlt, 
  FaChartBar, 
  FaRegListAlt,
  FaBullseye,
  FaCoins,
  FaSignOutAlt,
  FaWallet,
  FaBell
} from 'react-icons/fa';
import NotificationBadge from '../../components/ui/NotificationBadge';
import NotificationPanel from '../../components/ui/NotificationPanel';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checkAuth, signOut } = useAuthStore();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    checkAuth();
    
    // Si no hay usuario, redirigir al login
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, checkAuth, router]);

  // Si no hay usuario, mostrar un estado de carga
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E676]"></div>
      </div>
    );
  }

  // Función para comprobar si el enlace actual está activo
  const isActive = (path) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  // Lista de enlaces de navegación
  const navLinks = [
    {
      href: '/dashboard',
      text: 'Dashboard',
      icon: <FaChartLine className="h-5 w-5" />
    },
    {
      href: '/dashboard/transactions',
      text: 'Transacciones',
      icon: <FaExchangeAlt className="h-5 w-5" />
    },
    {
      href: '/dashboard/budgets',
      text: 'Presupuestos',
      icon: <FaCoins className="h-5 w-5" />
    },
    {
      href: '/dashboard/goals',
      text: 'Metas',
      icon: <FaBullseye className="h-5 w-5" />
    },
    {
      href: '/dashboard/analysis',
      text: 'Análisis',
      icon: <FaChartBar className="h-5 w-5" />
    },
    {
      href: '/dashboard/reports',
      text: 'Reportes',
      icon: <FaRegListAlt className="h-5 w-5" />
    },
    {
      href: '/dashboard/notifications',
      text: 'Notificaciones',
      icon: <FaBell className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Panel de notificaciones (siempre presente, pero visible/oculto según estado) */}
      <NotificationPanel />
      
      {/* Navbar */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xl font-bold flex items-center">
              <span className="inline-block mr-2 text-[#00E676]">
                <FaWallet className="h-6 w-6" />
              </span>
              Finanzas <span className="text-xs bg-gray-700 px-2 py-1 rounded ml-1">App</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.slice(0, 6).map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isActive(link.href) 
                    ? 'bg-[#00E676] bg-opacity-20 text-[#00E676]' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <div className="flex items-center gap-3">
              {/* Badge de notificaciones */}
              <NotificationBadge />
              
              <div className="w-8 h-8 rounded-full bg-[#00E676] flex items-center justify-center text-gray-900 font-medium">
                {user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              
              <button 
                onClick={signOut}
                className="text-gray-300 hover:text-white text-sm flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition-colors"
              >
                <FaSignOutAlt className="h-4 w-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-10">
        <div className="grid grid-cols-6 gap-1 p-1">
          {navLinks.slice(0, 6).map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs ${
                isActive(link.href)
                  ? 'text-[#00E676]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="mt-1">{link.text}</span>
            </Link>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 mb-16 md:mb-0">
        {children}
      </main>
    </div>
  );
} 