'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaChartLine, FaWallet, FaRegCalendarAlt, FaCog, FaTags, FaSignOutAlt, FaLaptop, FaBullseye, FaChartBar } from 'react-icons/fa';
import { useAuthStore } from '../../lib/store/auth-store';
import ProtectedRoute from '../../components/ui/ProtectedRoute';

export default function DashboardLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const pathname = usePathname();
  const { signOut, user } = useAuthStore();
  
  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <FaHome size={18} />,
    },
    {
      title: 'Transacciones',
      href: '/dashboard/transactions',
      icon: <FaWallet size={18} />,
    },
    {
      title: 'Categorías',
      href: '/dashboard/categories',
      icon: <FaTags size={18} />,
    },
    {
      title: 'Presupuestos',
      href: '/dashboard/budgets',
      icon: <FaRegCalendarAlt size={18} />,
    },
    {
      title: 'Metas Financieras',
      href: '/dashboard/goals',
      icon: <FaBullseye size={18} />,
    },
    {
      title: 'Análisis Financiero',
      href: '/dashboard/analysis',
      icon: <FaChartBar size={18} />,
    },
    {
      title: 'Configuración',
      href: '/dashboard/settings',
      icon: <FaCog size={18} />,
    },
  ];
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 ${
            showSidebar ? 'w-64' : 'w-20'
          } transition-all duration-300 ease-in-out flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className={`text-xl font-semibold text-white ${!showSidebar && 'hidden'}`}>
                Finanzas App
              </h2>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              >
                {showSidebar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>
            <nav className="mt-6">
              <ul className="space-y-2 px-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-gray-700 text-green-400'
                            : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className={`ml-3 ${!showSidebar && 'hidden'}`}>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-700">
            <div className={`flex items-center mb-4 ${!showSidebar && 'justify-center'}`}>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              {showSidebar && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate">{user?.email || 'Usuario'}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleSignOut}
              className={`flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 w-full ${
                !showSidebar && 'justify-center'
              }`}
            >
              <FaSignOutAlt size={18} />
              <span className={`ml-3 ${!showSidebar && 'hidden'}`}>Cerrar sesión</span>
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 