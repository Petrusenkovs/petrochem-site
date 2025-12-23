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
  published_date?: string;
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
    <div className="w-full h-full flex flex-col bg-slate-900 min-h-0">
      
      {/* --- ШАПКА --- */}
      <div 
        className="h-14 lg:h-16 px-4 flex justify-between items-center bg-slate-900 border-b border-slate-800 shrink-0"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="overflow-hidden flex-1 mr-2">
            <div className="text-[9px] lg:text-[10px] text-sky-500 font-bold uppercase tracking-widest leading-none mb-1">
                Тема
            </div>
            <h2 className="text-base lg:text-xl font-bold text-white leading-none truncate">
              {nodeId}
            </h2>
        </div>
        
        <button 
          onClick={onClose}
          className="p-1.5 lg:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all bg-slate-800/50"
        >
          <X size={20} />
        </button>
      </div>

      {/* --- СПИСОК --- */}
      <div 
        className="flex-1 overflow-y-auto min-h-0 p-3 lg:p-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        
        {loading ? (
           <div className="flex flex-col items-center justify-center h-full gap-3 opacity-70">
               <Loader2 className="animate-spin" size={24} />
               <p className="text-[10px] uppercase tracking-widest text-slate-500">Поиск...</p>
           </div>
        ) : (
           <>
              <div className="mb-3 px-1">
                <p className="text-slate-500 text-[10px] lg:text-xs">
                  Найдено материалов: <span className="text-slate-300 font-bold">{articles.length}</span>
                </p>
              </div>

              <div className="space-y-3 pb-8">
                {articles.map((article) => {
                    const displayDate = article.published_date || article.date_created;

                    return (
                        <Link key={article.id} href={`/news/${article.slug || article.id}`} className="block group">
                            <div className="relative bg-slate-950 border border-slate-800 p-3 lg:p-5 rounded-xl active:scale-[0.98] transition-all">
                                
                                {article.category && (
                                    <div className="absolute top-3 right-3 text-[8px] lg:text-[10px] font-bold px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
                                        {article.category}
                                    </div>
                                )}

                                <h3 className="text-sm lg:text-base font-bold text-white mb-1.5 pr-6 leading-snug">
                                    {article.title}
                                </h3>
                                
                                {article.excerpt && (
                                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                                        {article.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-1">
                                    <span className="text-[10px] lg:text-xs text-slate-600 flex items-center gap-1.5">
                                        <Calendar size={10} />
                                        {new Date(displayDate).toLocaleDateString('ru-RU', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <ArrowRight size={14} className="text-sky-500 opacity-80" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
                
                {!loading && articles.length === 0 && (
                    <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-900/30">
                        <FileText size={24} className="mx-auto text-slate-700 mb-2" />
                        <p className="text-slate-500 text-xs">Нет материалов</p>
                    </div>
                )}
              </div>
           </>
        )}
      </div>
    </div>
  );
}