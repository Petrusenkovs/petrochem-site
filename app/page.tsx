'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, CheckCircle2, XCircle, 
  FlaskConical, Factory, FileText, ScrollText, 
  Users, Activity, TrendingUp, Search, ShieldAlert, Settings, Briefcase, Leaf
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // Состояние для табов "Роли"
  const [activeRole, setActiveRole] = useState<'rd' | 'engineer' | 'manager'>('rd');

  return (
    <main className="relative z-10 overflow-hidden">
      
      {/* =========================================
          1. HERO SECTION 
      ========================================= */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 relative">
        {/* Фоновое свечение */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold tracking-wide mb-8 uppercase">
              v2.0 Intelligence Core Online
            </span>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight text-white">
              Мониторим всё инфополе,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-purple-400 to-sky-400">
                чтобы вы получили суть
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Отсекаем 90% информационного шума. 
              <span className="text-white font-medium block mt-2">
                Мы отслеживаем патенты, научные статьи и инсайды, пока другие пишут о ценах на нефть.
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link
              href="/news"
              className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              <span>Лента событий</span>
            </Link>
            <Link
              href="/network"
              className="px-8 py-4 bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-white rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Users className="w-5 h-5" />
              <span>Схема тегов</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. ФИЛЬТРАЦИЯ ШУМА (NOISE vs SIGNAL)
      ========================================= */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Фильтрация Шума</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Наши алгоритмы понимают контекст нефтехимии. Мы знаем разницу между "скачком акций" и "прорывом в катализе".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* ШУМ 1: Политика */}
            <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3 mb-6 text-red-400">
                <XCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">ШУМ: Политика</h3>
              </div>
              <ul className="space-y-4 text-slate-500 line-through decoration-red-500/30">
                <li>"Выборы повлияют на цены..."</li>
                <li>"Заявление министра о квотах..."</li>
                <li>"Слухи о перестановках в совете..."</li>
              </ul>
            </div>

            {/* СИГНАЛ: Технологии (Центральная карта) */}
            <div className="bg-slate-900/80 border-2 border-sky-500/50 rounded-2xl p-10 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative transform md:scale-110 z-10">
              {/* Анимация сканера */}
              <div className="absolute top-0 left-0 w-full h-1 bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-[scan_3s_ease-in-out_infinite] opacity-50" />
              
              <div className="flex items-center gap-3 mb-8">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-white">
                  ЧИСТЫЙ СИГНАЛ
                </h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Новый катализатор Pt-Sn</p>
                    <p className="text-sm text-sky-300">Селективность +4.5% (Патент BASF)</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">CFD-модель печи</p>
                    <p className="text-sm text-purple-300">Оптимизация змеевиков (Статья MDPI)</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">UOP Oleflex™ Проект</p>
                    <p className="text-sm text-emerald-300">Подписан EPC контракт (Китай)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* ШУМ 2: Финансы */}
            <div className="bg-slate-900/40 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm opacity-60 hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-3 mb-6 text-red-400">
                <XCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">ШУМ: Финансы</h3>
              </div>
              <ul className="space-y-4 text-slate-500 line-through decoration-red-500/30">
                <li>"Квартальный отчет Shell..."</li>
                <li>"Колебания курса валют..."</li>
                <li>"Общерыночная аналитика..."</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          3. ЖИЗНЕННЫЙ ЦИКЛ (TIMELINE)
      ========================================= */}
      <section className="py-24 bg-gradient-to-b from-transparent to-slate-900/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Жизненный Цикл Технологии</h2>
             <p className="text-slate-400">Связываем научную идею и реальное внедрение в единую цепочку событий.</p>
          </div>

          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
             
             <div className="flex items-center gap-4 mb-12 border-b border-white/10 pb-6">
                <span className="w-3 h-3 rounded-full bg-sky-500 animate-ping"></span>
                <h3 className="text-2xl text-white font-mono">
                   Мониторинг: <span className="text-sky-400 font-bold">"Электрический Крекинг"</span>
                </h3>
             </div>

             <div className="relative">
                <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-sky-900 via-sky-500 to-emerald-500 rounded-full opacity-30" />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   
                   <div className="relative group">
                      <div className="w-24 h-24 mx-auto bg-slate-950 border-2 border-sky-600 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                         <FlaskConical className="w-10 h-10 text-sky-400" />
                      </div>
                      <div className="text-center bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition">
                         <div className="text-xs text-sky-400 mb-1 font-mono">2023 Q1 • R&D</div>
                         <div className="font-bold text-white mb-2">Лабораторный тест</div>
                         <p className="text-xs text-slate-400">Публикация в Science: доказана эффективность нагрева.</p>
                      </div>
                   </div>

                   <div className="relative group">
                      <div className="w-24 h-24 mx-auto bg-slate-950 border-2 border-purple-600 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                         <ScrollText className="w-10 h-10 text-purple-400" />
                      </div>
                      <div className="text-center bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition">
                         <div className="text-xs text-purple-400 mb-1 font-mono">2024 Q2 • Лицензиар</div>
                         <div className="font-bold text-white mb-2">Анонс e-Furnace</div>
                         <p className="text-xs text-slate-400">Лицензиар заявляет о готовности пилотной установки.</p>
                      </div>
                   </div>

                   <div className="relative group">
                      <div className="w-24 h-24 mx-auto bg-slate-950 border-2 border-blue-600 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                         <FileText className="w-10 h-10 text-blue-400" />
                      </div>
                      <div className="text-center bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition">
                         <div className="text-xs text-blue-400 mb-1 font-mono">2025 Q1 • Контракт</div>
                         <div className="font-bold text-white mb-2">FEED Проект</div>
                         <p className="text-xs text-slate-400">Major Oil Co. подписывает контракт на проектирование.</p>
                      </div>
                   </div>

                   <div className="relative group">
                      <div className="w-24 h-24 mx-auto bg-slate-950 border-2 border-emerald-600 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                         <Factory className="w-10 h-10 text-emerald-400" />
                      </div>
                      <div className="text-center bg-white/5 p-4 rounded-xl border border-white/5 group-hover:bg-white/10 transition">
                         <div className="text-xs text-emerald-400 mb-1 font-mono">2026 Q4 • Запуск</div>
                         <div className="font-bold text-white mb-2">Ввод в строй</div>
                         <p className="text-xs text-slate-400">Ожидаемый старт промышленной эксплуатации.</p>
                      </div>
                   </div>

                </div>
             </div>
          </div>
        </div>
      </section>

      {/* =========================================
          4. ЭКСПЕРТЫ (RADAR)
      ========================================= */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto">
           <div className="mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Радар Экспертов</h2>
             <p className="text-slate-400">Мы отслеживаем активность ключевых фигур: патенты, выступления, статьи.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:border-sky-500/50 transition-colors group">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-purple-500 p-[2px]">
                       <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                          <Users className="text-white w-8 h-8" />
                       </div>
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-white">Dr. Jane Smith</h4>
                       <p className="text-sm text-sky-400">Linde Engineering</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-lg">
                       <ScrollText className="w-4 h-4 text-yellow-400" />
                       <span>Патент: Helium Capture</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-lg">
                       <FileText className="w-4 h-4 text-sky-400" />
                       <span>Статья: Cryogenic Distillation</span>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors group">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-[2px]">
                       <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                          <Users className="text-white w-8 h-8" />
                       </div>
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-white">Dr. M. Adewale</h4>
                       <p className="text-sm text-emerald-400">UOP Honeywell</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-lg">
                       <Users className="w-4 h-4 text-purple-400" />
                       <span>Спикер: AIChE 2025</span>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-colors group">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-400 to-orange-500 p-[2px]">
                       <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                          <Users className="text-white w-8 h-8" />
                       </div>
                    </div>
                    <div>
                       <h4 className="text-lg font-bold text-white">Dr. Chen Kai</h4>
                       <p className="text-sm text-orange-400">Sinopec R&D</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-300 bg-white/5 p-3 rounded-lg">
                       <FileText className="w-4 h-4 text-blue-400" />
                       <span>Статья: Zeolite Catalysts</span>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* =========================================
          5. ПРАВИЛЬНАЯ ИНФОРМАЦИЯ ДЛЯ ПРАВИЛЬНОЙ РОЛИ
      ========================================= */}
      <section className="py-24 px-4 bg-slate-900/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Персонализация под Роль</h2>
             <p className="text-slate-400">Один источник правды, но разный взгляд на данные для каждого специалиста.</p>
           </div>

           <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Переключатели Табов */}
              <div className="flex border-b border-white/10">
                 <button 
                   onClick={() => setActiveRole('rd')}
                   className={`flex-1 py-5 text-center font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/5
                     ${activeRole === 'rd' ? 'text-sky-400 border-b-2 border-sky-400 bg-sky-500/5' : 'text-slate-500'}`}
                 >
                   R&D Специалист
                 </button>
                 <button 
                   onClick={() => setActiveRole('engineer')}
                   className={`flex-1 py-5 text-center font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/5
                     ${activeRole === 'engineer' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5' : 'text-slate-500'}`}
                 >
                   Инженер-Технолог
                 </button>
                 <button 
                   onClick={() => setActiveRole('manager')}
                   className={`flex-1 py-5 text-center font-bold text-sm uppercase tracking-wider transition-all hover:bg-white/5
                     ${activeRole === 'manager' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/5' : 'text-slate-500'}`}
                 >
                   Директор / Главный Инженер
                 </button>
              </div>

              {/* Контент Табов */}
              <div className="p-8 md:p-12 min-h-[400px]">
                 <AnimatePresence mode="wait">
                    
                    {/* R&D TAB */}
                    {activeRole === 'rd' && (
                      <motion.div 
                        key="rd"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                         <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FlaskConical className="text-sky-400 w-8 h-8" />
                            <span>Академические исследования и инновации</span>
                         </h3>
                         <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-sky-500">
                               <div className="text-xs text-sky-400 mb-2 font-bold uppercase">Наука</div>
                               <h4 className="text-white font-bold mb-2">CFD-Моделирование</h4>
                               <p className="text-slate-400 text-sm">Новые подходы к расчету гидродинамики в змеевиках печей пиролиза.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-sky-500">
                               <div className="text-xs text-sky-400 mb-2 font-bold uppercase">Химия</div>
                               <h4 className="text-white font-bold mb-2">Цеолитные Катализаторы</h4>
                               <p className="text-slate-400 text-sm">Анализ селективности новых марок катализаторов для MTO процессов.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-sky-500">
                               <div className="text-xs text-sky-400 mb-2 font-bold uppercase">IP / Права</div>
                               <h4 className="text-white font-bold mb-2">Патентный Ландшафт</h4>
                               <p className="text-slate-400 text-sm">Еженедельный обзор новых патентов по биоразлагаемым полимерам.</p>
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {/* ENGINEER TAB */}
                    {activeRole === 'engineer' && (
                      <motion.div 
                        key="engineer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                         <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Settings className="text-emerald-400 w-8 h-8" />
                            <span>Лучшие Практики и Эксплуатация</span>
                         </h3>
                         <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-emerald-500">
                               <div className="text-xs text-emerald-400 mb-2 font-bold uppercase">Кейс</div>
                               <h4 className="text-white font-bold mb-2">Digital Twin Внедрение</h4>
                               <p className="text-slate-400 text-sm">Как завод в Техасе снизил потребление пара на 5% с помощью цифрового двойника.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-emerald-500">
                               <div className="text-xs text-red-400 mb-2 font-bold uppercase">Безопасность</div>
                               <h4 className="text-white font-bold mb-2">Инцидент на CCUS</h4>
                               <p className="text-slate-400 text-sm">Разбор причин коррозии абсорбера на установке улавливания CO2.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-emerald-500">
                               <div className="text-xs text-emerald-400 mb-2 font-bold uppercase">Оптимизация</div>
                               <h4 className="text-white font-bold mb-2">APC Алгоритмы</h4>
                               <p className="text-slate-400 text-sm">Настройка предиктивного управления для ректификационных колонн.</p>
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {/* MANAGER TAB */}
                    {activeRole === 'manager' && (
                      <motion.div 
                        key="manager"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                         <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Briefcase className="text-purple-400 w-8 h-8" />
                            <span>Стратегия и Эффективность</span>
                         </h3>
                         <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-purple-500">
                               <div className="text-xs text-purple-400 mb-2 font-bold uppercase">Макро</div>
                               <h4 className="text-white font-bold mb-2">Тренды 2030</h4>
                               <p className="text-slate-400 text-sm">Прогноз спроса на олефины и влияние энергоперехода на маржинальность.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-purple-500">
                               <div className="text-xs text-purple-400 mb-2 font-bold uppercase">Финансы</div>
                               <h4 className="text-white font-bold mb-2">ROI от AI</h4>
                               <p className="text-slate-400 text-sm">Экономический анализ внедрения систем машинного обучения на производстве.</p>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-purple-500">
                               <div className="text-xs text-green-400 mb-2 font-bold uppercase">ESG</div>
                               <h4 className="text-white font-bold mb-2">Углеродная Нейтральность</h4>
                               <p className="text-slate-400 text-sm">Стратегии декарбонизации лидеров рынка (Shell, BASF, Sinopec).</p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </section>

      {/* =========================================
          6. CTA (ФИНАЛ)
      ========================================= */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-sky-500/5" />
          
          <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Доступ к системе</h2>
          <p className="text-slate-300 text-lg mb-8 relative z-10">
            Начните использовать профессиональную аналитику уже сегодня.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
             <Link href="/news" className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-lg transition-all hover:-translate-y-1">
                Читать Ленту
             </Link>
             <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all hover:-translate-y-1">
                Запросить Демо
             </button>
          </div>
        </div>
      </section>

    </main>
  );
}