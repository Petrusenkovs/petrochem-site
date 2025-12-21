'use client';

import { X, ArrowRight, Loader2, Calendar, FileText } from 'lucide-react'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NetworkSidebarProps {
  nodeId: string | null;
  onClose: () => void;
}

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

  useEffect(() => {
    if (!nodeId) {
        setArticles([]);
        return;
    }

    async function fetchArticlesByTag() {
      setLoading(true);
      setArticles([]);
      try {
        const res = await fetch(`/api/articles?tag=${encodeURIComponent(nodeId || "")}`);
        if (!res.ok) throw new Error('Ошибка');
        const json = await res.json();
        if (json.data) setArticles(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchArticlesByTag();
  }, [nodeId]);

  return (
    // ВАЖНОЕ ИЗМЕНЕНИЕ:
    // Мы убрали 'fixed', 'top-0', 'right-0', 'w-[400px]'
    // Теперь этот блок просто заполняет родительский контейнер (который мы настроили в NetworkClient)
    <div className="w-full h-full flex flex-col bg-slate-900 border-l border-slate-800">
      
      {/* ШАПКА: Прижата к верху (sticky) */}
      <div className="h-16 px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0 sticky top-0 z-10">
        <div className="overflow-hidden">
            <div className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-0.5">
                Выбрано
            </div>
            <h2 className="text-xl font-bold text-white leading-tight truncate max-w-[200px] lg:max-w-[300px]">
              {nodeId}
            </h2>
        </div>
        
        {/* Кнопку закрытия оставляем только для десктопа, на мобилке она есть у родителя. 
            Но можно оставить и тут, вреда не будет. */}
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* КОНТЕНТ: Занимает всё оставшееся место и скроллится */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        
        {loading ? (
           <div className="flex flex-col items-center justify-center h-full text-sky-500 gap-3">
               <Loader2 className="animate-spin" size={32} />
               <p className="text-xs text-slate-400 animate-pulse">Поиск...</p>
           </div>
        ) : (
           <>
              <div className="mb-4">
                <p className="text-slate-500 text-xs">
                  Найдено: <span className="text-slate-300 font-bold">{articles.length}</span>
                </p>
              </div>

              <div className="space-y-3 pb-8">
                {articles.map((article) => (
                    <Link key={article.id} href={`/news/${article.slug || article.id}`} className="block group">
                        <div className="relative bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-sky-500/50 transition-all active:scale-[0.98]">
                            
                            {article.category && (
                                <div className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                                    {article.category}
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-white mb-2 pr-8 leading-snug group-hover:text-sky-400">
                                {article.title}
                            </h3>
                            
                            <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-2">
                                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(article.date_created).toLocaleDateString('ru-RU')}
                                </span>
                                <ArrowRight size={14} className="text-sky-500 -ml-2 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            </div>
                        </div>
                    </Link>
                ))}
                
                {!loading && articles.length === 0 && (
                    <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/50">
                        <FileText size={32} className="mx-auto text-slate-700 mb-2" />
                        <p className="text-slate-400 text-sm">Нет материалов</p>
                    </div>
                )}
              </div>
           </>
        )}
      </div>
    </div>
  );
}