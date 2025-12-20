'use client';

import { X, ArrowRight, Loader2, Calendar, FileText } from 'lucide-react'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NetworkSidebarProps {
  nodeId: string | null;
  onClose: () => void;
}

// Интерфейс статьи для типизации
interface Article {
  id: string | number;
  title: string;
  slug: string;
  date_created: string;
  category?: string;
  excerpt?: string;
}

export default function NetworkSidebar({ nodeId, onClose }: NetworkSidebarProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Берем URL из переменных окружения
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://n8n6179.hostkey.in';
  
  // ВАЖНО: Убедитесь, что тут правильное имя коллекции ('articles' или 'news')
  const COLLECTION = 'articles'; 

  useEffect(() => {
    if (!nodeId) {
        setArticles([]);
        return;
    }

    async function fetchArticlesByTag() {
      setLoading(true);
      setArticles([]);
      try {
        console.log(`🔍 Запрос через API Proxy для тега: ${nodeId}`);

        // ИЗМЕНЕНИЕ: Обращаемся к своему же серверу, а не к Directus напрямую
        // Это обходит блокировку CORS
        const res = await fetch(`/api/articles?tag=${encodeURIComponent(nodeId || "")}`);
        
        if (!res.ok) throw new Error('Ошибка при загрузке данных');
        
        const json = await res.json();
        
        if (json.data) {
          setArticles(json.data);
        }
      } catch (e) {
        console.error("Ошибка загрузки статей:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchArticlesByTag();
  }, [nodeId]);

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-[400px] bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 transition-transform duration-500 ease-out z-50 shadow-2xl ${
        nodeId ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Шапка */}
      <div className="h-20 px-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div>
            <div className="text-xs text-sky-500 font-bold uppercase tracking-widest mb-1">
                Выбранная тема
            </div>
            <h2 className="text-2xl font-bold text-white leading-none">
              {nodeId}
            </h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Контент */}
      <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-sky-500 gap-4">
               <Loader2 className="animate-spin" size={40} />
               <p className="text-sm text-slate-400 animate-pulse">Анализ связей...</p>
           </div>
        ) : (
           <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-slate-400 text-sm">
                  Найдено материалов: <span className="text-white font-bold ml-1">{articles.length}</span>
                </p>
              </div>

              <div className="space-y-4">
                {articles.map((article) => (
                    <Link key={article.id} href={`/news/${article.slug || article.id}`} className="block group">
                        <div className="relative bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.1)] transition-all duration-300 group-hover:-translate-y-1">
                            
                            {/* Категория */}
                            {article.category && (
                                <div className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 bg-slate-800 rounded text-slate-300">
                                    {article.category}
                                </div>
                            )}

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors pr-12 leading-snug">
                                {article.title}
                            </h3>
                            
                            {article.excerpt && (
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                    {article.excerpt}
                                </p>
                            )}

                            <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-2">
                                <div className="flex items-center text-xs text-slate-500 gap-2">
                                    <Calendar size={12} />
                                    <span>
                                        {new Date(article.date_created).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <span className="text-xs text-sky-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Читать <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
                
                {/* Состояние: Пусто */}
                {!loading && articles.length === 0 && (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/50">
                        <FileText size={48} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-300 font-medium mb-1">Материалы не найдены</p>
                        <p className="text-sm text-slate-500">
                            Попробуйте выбрать соседний узел или другую тему.
                        </p>
                    </div>
                )}
              </div>
           </>
        )}
      </div>
    </div>
  );
}