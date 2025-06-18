'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaChartLine, FaWallet, FaRegCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import StatsSection from '../components/home/StatsSection';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CommunityStatsSection from '../components/home/CommunityStatsSection';
import CtaSection from '../components/home/CtaSection';
import Footer from '../components/home/Footer';



export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <FaChartLine className="w-8 h-8 text-[#00E676]" />,
      title: "Análisis detallado",
      description: "Visualiza tus finanzas con gráficos interactivos que te permiten entender claramente tus hábitos financieros."
    },
    {
      icon: <FaWallet className="w-8 h-8 text-[#00E676]" />,
      title: "Gestión de gastos",
      description: "Registra fácilmente tus ingresos y gastos por categorías, para mantener todo organizado."
    },
    {
      icon: <FaRegCalendarAlt className="w-8 h-8 text-[#00E676]" />,
      title: "Presupuestos mensuales",
      description: "Establece límites de gastos y recibe alertas cuando estés por excederlos."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-[#00E676]" />,
      title: "Seguridad garantizada",
      description: "Tus datos financieros están protegidos con la más alta tecnología de encriptación."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <HeroSection isVisible={isVisible} fadeIn={fadeIn} />

      <FeaturesSection features={features} />

      <StatsSection />

      <CommunityStatsSection />

      <CtaSection />

      <Footer />
    </div>
  );
} 