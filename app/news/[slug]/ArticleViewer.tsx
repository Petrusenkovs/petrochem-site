'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Type, Moon, Sun, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getImageUrl } from '@/lib/utils';
import clsx from 'clsx';

// Типы
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
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [showSettings, setShowSettings] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Следим за скроллом для шапки
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === МАГИЯ DIRECTUS (Функция очистки) ===
  // Эта функция делает парсер "прощающим", как в Directus
  const cleanContent = (text: string) => {
    if (!text) return '';
    return text
      // 1. Превращаем текстовые "\n" в реальные переносы (если Python их экранировал)
      .replace(/\\n/g, '\n')
      // 2. Если перед # нет новой строки, добавляем её принудительно
      // Было: "Текст.### Заголовок" -> Стало: "Текст.\n\n### Заголовок"
      .replace(/([^\n])(#+\s)/g, '$1\n\n$2')
      // 3. Убираем лишние дубли (на случай, если скрипт переборщил)
      .replace(/#+\s+#+\s/g, '## ');
  };

  // Готовим контент перед рендером
  const processedContent = cleanContent(post.content);

  // Классы тем
  const themeClasses = {
    dark: 'bg-slate-900 text-slate-300',
    light: 'bg-white text-gray-800',
    sepia: 'bg-[#fdf6e3] text-[#433422]',
  };

  // Классы типографики (настраиваем цвета заголовков и ссылок для каждой темы)
  const proseThemeClasses = {
    dark: 'prose-invert prose-p:text-slate-300 prose-headings:text-white prose-a:text-sky-400 prose-strong:text-white prose-li:text-slate-300',
    light: 'prose-gray prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900 prose-li:text-gray-700',
    sepia: 'prose-stone prose-headings:text-[#433422] prose-p:text-[#433422] prose-a:text-[#b58900] prose-strong:text-[#2f2518] prose-li:text-[#433422]',
  };

  return (
    // Применяем инлайн-стиль для шрифта, чтобы он точно сработал
    <div 
      className={clsx('min-h-screen transition-colors duration-300', themeClasses[theme])}
      style={{ fontSize: fontSize === 'large' ? '19px' : '16px', lineHeight: fontSize === 'large' ? '1.8' : '1.6' }}
    >
      
      {/* HEADER */}
      <header 
        className={clsx(
          'sticky top-0 z-50 w-full px-4 py-3 transition-all duration-300 border-b',
          isScrolled 
            ? (theme === 'dark' ? 'bg-slate-900/95 border-slate-800 backdrop-blur' : 
               theme === 'sepia' ? 'bg-[#fdf6e3]/95 border-[#ede0c1] backdrop-blur' : 
               'bg-white/95 border-gray-200 backdrop-blur')
            : 'bg-transparent border-transparent'
        )}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            href="/news" 
            className="flex items-center text-sm font-medium opacity-70 hover:opacity-100 transition-opacity px-3 py-2 rounded-lg hover:bg-current/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Link>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-current/10 transition-colors"
              title="Настройки чтения"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-72 p-5 rounded-xl shadow-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="space-y-5">
                  {/* Размер шрифта */}
                  <div>
                    <p className="text-xs font-bold opacity-50 uppercase mb-3 tracking-wider">Размер текста</p>
                    <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                      <button 
                        onClick={() => setFontSize('normal')}
                        className={clsx("flex-1 py-2 text-sm rounded-md transition-all font-medium", fontSize === 'normal' ? "bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400" : "opacity-60 hover:opacity-100")}
                      >
                        Стандарт
                      </button>
                      <button 
                        onClick={() => setFontSize('large')}
                        className={clsx("flex-1 py-2 text-lg rounded-md transition-all font-medium", fontSize === 'large' ? "bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400" : "opacity-60 hover:opacity-100")}
                      >
                        Крупный
                      </button>
                    </div>
                  </div>

                  {/* Тема */}
                  <div>
                    <p className="text-xs font-bold opacity-50 uppercase mb-3 tracking-wider">Цвет фона</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => setTheme('light')}
                        className={clsx("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all bg-white text-gray-900", theme === 'light' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200 hover:border-gray-300")}
                      >
                        <Sun className="w-5 h-5" />
                        <span className="text-xs font-medium">Светлая</span>
                      </button>
                      <button 
                        onClick={() => setTheme('sepia')}
                        className={clsx("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all bg-[#fdf6e3] text-[#5b4636]", theme === 'sepia' ? "border-[#b58900] ring-2 ring-[#b58900]/20" : "border-[#ede0c1] hover:border-[#dcc080]")}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span className="text-xs font-medium">Книга</span>
                      </button>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={clsx("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all bg-slate-900 text-white", theme === 'dark' ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-700 hover:border-slate-600")}
                      >
                        <Moon className="w-5 h-5" />
                        <span className="text-xs font-medium">Темная</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 pb-24 pt-6">
        
        {post.image && (
          <div className="w-full aspect-video relative rounded-2xl overflow-hidden mb-10 shadow-xl bg-gray-200 dark:bg-slate-800">
            <img 
              src={getImageUrl(post.image, { width: 1200 }) || ''} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-10 opacity-60 text-sm border-b border-current/10 pb-6">
           <span className="font-medium">{new Date(post.date_created).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
           {post.category && <span className="px-3 py-1 rounded-full border border-current/20 text-xs font-semibold uppercase tracking-wide">{post.category}</span>}
        </div>

        {/* ЗДЕСЬ ВЫВОДИТСЯ ТЕКСТ С УЧЕТОМ ВСЕХ НАСТРОЕК */}
        <div 
          className={clsx(
            'prose max-w-none transition-all duration-300 break-words', // break-words важен для длинных слов
            proseThemeClasses[theme],
            // Убираем prose-lg/xl отсюда и полагаемся на style={{ fontSize }} в родителе для точности
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {processedContent}
          </ReactMarkdown>
        </div>

      </main>
    </div>
  );
}