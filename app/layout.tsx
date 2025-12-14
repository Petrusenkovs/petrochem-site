import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NeuralBackground from "@/components/background/NeuralBackground";

// Загружаем шрифт Inter
const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "PetroChem AI Analyst",
  description: "Система мониторинга и анализа нефтехимической отрасли",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        
        {/* 1. Глобальный 3D Фон */}
        <NeuralBackground />

        {/* 2. Навигация (Шапка) */}
        <Navbar />

        {/* 3. Контент страницы (с отступом сверху, чтобы не заезжал под шапку) */}
        <div className="pt-16">
          {children}
        </div>

      </body>
    </html>
  );
}