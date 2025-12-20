'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Импорт для внутренних ссылок
import { ArrowLeft, Settings, ExternalLink } from 'lucide-react'; // Добавил иконку ExternalLink
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getImageUrl } from '@/lib/utils';
import clsx from 'clsx';

// --- ИМПОРТЫ ДЛЯ ФОРМУЛ ---
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
// --------------------------

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const normalizeContent = (text: string) => {
    if (!text) return '';
    return text
      .replace(/\\"/g, '"')
      .replace(/\*\*\\n\\n/g, '\n\n')
      .replace(/^##\s*●\s*(.*)/gm, '* **$1**')
      .replace(/^#####\s*●\s*(.*)/gm, '* $1')
      .replace(/●/g, '*')
      .replace(/(\d+)\.\s*####\s*(.*)/g, '$1. **$2**')
      .replace(/^####\s+(.*)/gm, '\n**$1**\n')
      .replace(/([^\n])(#\s)/g, '$1\n\n$2')
      
      // --- ИСПРАВЛЕНИЕ ДЛЯ ТАБЛИЦ ---
      // Старая версия ломала таблицы, вставляя пустые строки внутрь них.
      // Новая версия: добавляем \n\n только если следующая строка НЕ начинается с "|"
      .replace(/\n(?![|\n])/g, '\n\n'); 
  };

  const finalContent = normalizeContent(post.content);

  const themeClasses = {
    dark: 'bg-[#0f172a] text-slate-300',
    light: 'bg-white text-gray-900',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]',
  };

  const typographyClasses = clsx(
    'prose max-w-none transition-all duration-300',
    theme === 'dark' && 'prose-invert prose-headings:text-white prose-th:text-white prose-td:text-slate-300',
    theme === 'light' && 'prose-gray prose-headings:text-black prose-th:text-gray-900',
    theme === 'sepia' && 'prose-stone prose-headings:text-[#433422] prose-p:text-[#5b4636] prose-th:text-[#433422]'
  );

  if (!mounted) return null;

  return (
    <div
      className={clsx('min-h-screen transition-colors duration-500', themeClasses[theme])}
      style={{ fontSize: fontSize === 'large' ? '22px' : '18px' }}
    >
      <header className="sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
        <Link href="/news" className="flex items-center text-sm font-bold opacity-80 hover:opacity-100 transition-all">
          <ArrowLeft className="w-5 h-5 mr-2" />
          НАЗАД
        </Link>

        <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-current/10">
            <Settings className="w-6 h-6" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-3 w-72 p-6 rounded-2xl shadow-2xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 z-50">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">Шрифт</p>
              <div className="flex gap-2 mb-6">
                <button onClick={() => setFontSize('normal')} className={clsx("flex-1 py-2 rounded-lg border-2 transition", fontSize === 'normal' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-transparent bg-gray-100 dark:bg-slate-700")}>Аа</button>
                <button onClick={() => setFontSize('large')} className={clsx("flex-1 py-2 rounded-lg border-2 transition text-xl", fontSize === 'large' ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-transparent bg-gray-100 dark:bg-slate-700")}>Аа</button>
              </div>

              <p className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">Тема</p>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setTheme('light')} className="p-2 rounded-lg border bg-white text-black text-[10px] font-bold">LIGHT</button>
                <button onClick={() => setTheme('sepia')} className="p-2 rounded-lg border bg-[#f4ecd8] text-[#5b4636] text-[10px] font-bold">SEPIA</button>
                <button onClick={() => setTheme('dark')} className="p-2 rounded-lg border bg-slate-900 text-white text-[10px] font-bold">DARK</button>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-32 pt-12">
        <h1 className="text-4xl md:text-6xl font-black mb-10 leading-[1.1] tracking-tighter">
          {post.title}
        </h1>

        {post.image && (
          <div className="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <img src={getImageUrl(post.image, { width: 1200 }) || ''} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className={typographyClasses}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={{
              // Стили текста
              p: ({ node, ...props }) => <p style={{ fontSize: 'inherit', lineHeight: '1.7' }} className="mb-6" {...props} />,
              li: ({ node, ...props }) => <li style={{ fontSize: 'inherit' }} className="mb-2" {...props} />,
              h1: ({ node, ...props }) => <h1 className="text-4xl font-black mt-12 mb-6" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-10 mb-4" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-3" {...props} />,

              // --- 2. ИСПРАВЛЕНИЕ ССЫЛОК (LINKS) ---
              a: ({ node, href, children, ...props }) => {
                if (!href) return <a {...props}>{children}</a>;
                
                // Проверяем, внутренняя это ссылка или внешняя
                const isInternal = href.startsWith('/') || href.startsWith('#');
                const linkStyles = "text-blue-600 dark:text-sky-400 font-bold underline decoration-2 decoration-blue-500/30 hover:decoration-blue-500 transition-all";

                if (isInternal) {
                   return <Link href={href} className={linkStyles} {...props}>{children}</Link>;
                }

                return (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={clsx(linkStyles, "inline-flex items-baseline")}
                    {...props}
                  >
                    {children}
                    <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                  </a>
                );
              },

              // --- 1. ИСПРАВЛЕНИЕ ТАБЛИЦ ---
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-8 rounded-xl border border-current/10 shadow-sm">
                  <table className="w-full text-left border-collapse" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => <thead className="bg-current/5 border-b border-current/10" {...props} />,
              tbody: ({ node, ...props }) => <tbody className="divide-y divide-current/10" {...props} />, // Добавлено разделение строк
              th: ({ node, ...props }) => <th className="p-4 font-bold text-sm uppercase tracking-wider opacity-90" {...props} />,
              td: ({ node, ...props }) => <td className="p-4 text-sm whitespace-pre-wrap" {...props} />, // whitespace-pre-wrap сохраняет форматирование внутри ячеек
            }}
          >
            {finalContent}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  );
}