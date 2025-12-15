'use client'; // 👈 Обязательно: это клиентский компонент

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Type, Moon, Sun, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getImageUrl } from '@/lib/utils';
import clsx from 'clsx'; // Помогает удобно соединять классы

// Типы для наших настроек
type Theme = 'dark' | 'light' | 'sepia';
type FontSize = 'normal' | 'large';

interface ArticleViewerProps {
  post: {
    title: string;
    image: string;
    content: string;
    date_created: string;
    category: string;
  };
}

export default function ArticleViewer({ post }: ArticleViewerProps) {
  // --- Состояния интерфейса ---
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [showSettings, setShowSettings] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Следим за скроллом, чтобы сделать шапку полупрозрачной при прокрутке
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Настройки тем (цвета фона и текста) ---
  const themeClasses = {
    dark: 'bg-slate-900 text-slate-300',
    light: 'bg-white text-gray-800',
    sepia: 'bg-[#fdf6e3] text-[#5b4636]', // Тот самый "книжный" желтоватый
  };

  // --- Настройки стилей текста (Tailwind Typography) ---
  // prose-invert нужен для темной темы, чтобы текст стал светлым
  const proseThemeClasses = {
    dark: 'prose-invert prose-p:text-slate-300 prose-headings:text-white prose-a:text-sky-400',
    light: 'prose-gray prose-headings:text-gray-900 prose-a:text-blue-600',
    sepia: 'prose-stone prose-headings:text-[#433422] prose-a:text-[#b58900]',
  };

  return (
    <div className={clsx('min-h-screen transition-colors duration-300', themeClasses[theme])}>
      
      {/* === ВЕРХНЯЯ ПАНЕЛЬ (Sticky Header) === 
        Всегда видна сверху. Содержит кнопку "Назад" и настройки.
      */}
      <header 
        className={clsx(
          'sticky top-0 z-50 w-full px-4 py-3 transition-all duration-300 border-b',
          isScrolled 
            ? (theme === 'dark' ? 'bg-slate-900/90 border-slate-800 backdrop-blur' : 
               theme === 'sepia' ? 'bg-[#fdf6e3]/90 border-[#ede0c1] backdrop-blur' : 
               'bg-white/90 border-gray-200 backdrop-blur')
            : 'bg-transparent border-transparent'
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Кнопка НАЗАД (Всегда видна) */}
          <Link 
            href="/news" 
            className={clsx(
              "flex items-center text-sm font-medium transition-colors rounded-lg px-3 py-2 hover:bg-opacity-10 hover:bg-current",
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Link>

          {/* Кнопка НАСТРОЙКИ */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-current transition-colors"
              title="Настройки чтения"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Выпадающее меню настроек */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-64 p-4 rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-200 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-4">
                  {/* Выбор размера шрифта */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Размер шрифта</p>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => setFontSize('normal')}
                        className={clsx("flex-1 py-1 text-sm rounded-md transition-all", fontSize === 'normal' ? "bg-white shadow text-blue-600 font-bold" : "text-gray-500")}
                      >
                        Аа
                      </button>
                      <button 
                        onClick={() => setFontSize('large')}
                        className={clsx("flex-1 py-1 text-lg rounded-md transition-all", fontSize === 'large' ? "bg-white shadow text-blue-600 font-bold" : "text-gray-500")}
                      >
                        Аа
                      </button>
                    </div>
                  </div>

                  {/* Выбор темы */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Тема</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setTheme('light')}
                        className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all", theme === 'light' ? "border-blue-500 bg-gray-50" : "border-transparent hover:bg-gray-100")}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-xs">Светлая</span>
                      </button>
                      <button 
                        onClick={() => setTheme('sepia')}
                        className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all bg-[#fdf6e3]", theme === 'sepia' ? "border-[#b58900]" : "border-transparent hover:brightness-95")}
                      >
                        <BookOpen className="w-4 h-4 text-[#5b4636]" />
                        <span className="text-xs text-[#5b4636]">Книга</span>
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={clsx("flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all bg-slate-900 text-white", theme === 'dark' ? "border-blue-500" : "border-transparent hover:bg-slate-800")}
                      >
                        <Moon className="w-4 h-4" />
                        <span className="text-xs">Темная</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* === КОНТЕНТ СТАТЬИ === 
      */}
      <main className="max-w-3xl mx-auto px-4 pb-20">
        
        {/* Картинка статьи */}
        {post.image && (
          <div className="w-full aspect-video relative rounded-2xl overflow-hidden mb-8 shadow-lg mt-4">
            <img 
              src={getImageUrl(post.image, { width: 1200 }) || ''} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Заголовок */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Инфо о статье */}
        <div className="flex items-center gap-4 mb-8 opacity-70 text-sm">
           <span>{new Date(post.date_created).toLocaleDateString('ru-RU')}</span>
           {post.category && <span className="px-2 py-0.5 rounded-full border border-current opacity-60">{post.category}</span>}
        </div>

        {/* ⚠️ ГЛАВНОЕ ИСПРАВЛЕНИЕ: ReactMarkdown вместо html-parse
           Это превратит твои # и ** в красивые заголовки и жирный текст.
        */}
        <div 
          className={clsx(
            'prose max-w-none transition-all duration-300',
            // Применяем тему типографики
            proseThemeClasses[theme],
            // Применяем размер шрифта
            fontSize === 'large' ? 'prose-xl' : 'prose-lg'
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

      </main>
    </div>
  );
}