import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Finanzas Personales',
  description: 'Aplicación para gestionar tus finanzas personales',
};

import ClientLayout from '@/components/ClientLayout';

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geist.className} h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <ClientLayout>
          {children}
          <Toaster position="top-right" />
        </ClientLayout>
      </body>
    </html>
  );
} 