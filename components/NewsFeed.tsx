'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Tag, Calendar, Filter, X } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

export default function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  // 1. Извлекаем все уникальные категории из статей для фильтра
  const categories = useMemo(() => {
    const cats = new Set<string>(['Все']);
    articles.forEach(a => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats);
  }, [articles]);

  // 2. Логика фильтрации
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Фильтр по категории
      const matchCategory = selectedCategory === 'Все' || article.category === selectedCategory;
      
      // Поиск по тексту (Заголовок или Теги)
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        article.title.toLowerCase().includes(query) || 
        (article.tags && article.tags.toString().toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      
      {/* ПАНЕЛЬ УПРАВЛЕНИЯ (Поиск и Фильтры) */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
          
          {/* Поле поиска */}
          <div className="relative w-full md:w-1/2 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Поиск по названию или тегу..."
              className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Фильтр разделов (Табы) */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]'
                    : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* РЕЗУЛЬТАТЫ (Сетка) */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl text-white font-medium">Ничего не найдено</h3>
          <p className="text-slate-500 mt-2">Попробуйте изменить запрос или категорию.</p>
          <button 
             onClick={() => {setSearchQuery(''); setSelectedCategory('Все');}}
             className="mt-4 text-sky-400 hover:text-sky-300 underline"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((post) => (
            <Link 
              href={`/news/${post.slug}`} 
              key={post.UUID || post.id} 
              className="group flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/50 transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] hover:-translate-y-1 h-full"
            >
              {/* Картинка */}
              <div className="h-52 overflow-hidden bg-slate-950 relative">
                {post.image ? (
                  <Image 
                    src={getImageUrl(post.image, { width: 600 }) || ''} 
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <span className="text-4xl opacity-20">📷</span>
                  </div>
                )}
                
                {/* Категория поверх картинки */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category || 'News'}
                </div>
              </div>

              {/* Контент */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-mono">
                  <span className="flex items-center text-sky-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.date_created).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-sky-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                  {post.excerpt}
                </p>

                {/* Теги внизу карточки */}
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                    {(Array.isArray(post.tags) ? post.tags : post.tags.toString().split(',')).slice(0, 3).map((tag: any, idx: number) => {
                      // Обработка если тег объект или строка
                      const tagName = typeof tag === 'string' ? tag.trim() : (tag.name || 'Tag');
                      return (
                        <span key={idx} className="flex items-center text-[10px] uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded">
                          <Tag className="w-3 h-3 mr-1 opacity-50" />
                          {tagName}
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}