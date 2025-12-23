'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Tag, Calendar, Filter, X, ArrowRight } from 'lucide-react';
import { NewsArticle } from '@/types/news';
import { getImageUrl } from '@/lib/utils'; // Убедитесь, что эта утилита у вас есть

interface NewsFeedProps {
  articles: NewsArticle[];
}

export default function NewsFeed({ articles = [] }: NewsFeedProps) {
  // --- СОСТОЯНИЯ ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  
  // Добавляем состояния для Дат и Сортировки
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // 1. Извлекаем уникальные категории
  const categories = useMemo(() => {
    const cats = new Set<string>(['Все']);
    articles.forEach(a => {
      if (a.category) cats.add(a.category);
    });
    return Array.from(cats);
  }, [articles]);

  // 2. ЕДИНАЯ ЛОГИКА ФИЛЬТРАЦИИ И СОРТИРОВКИ
  const filteredAndSortedArticles = useMemo(() => {
    let result = [...articles];

    // A. Фильтрация
    result = result.filter((article) => {
      // 1. Категория
      const matchCategory = selectedCategory === 'Все' || article.category === selectedCategory;
      
      // 2. Поиск (Заголовок или Теги)
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        article.title.toLowerCase().includes(query) || 
        (article.tags && article.tags.toString().toLowerCase().includes(query));

      // 3. Даты
      // Определяем дату для сравнения (Date Published > Date Created)
      const articleDateStr = article.published_date || article.date_created;
      const articleTime = new Date(articleDateStr).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      // Конец дня для endDate
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity; 
      
      const matchDate = articleTime >= start && articleTime < end;

      return matchCategory && matchSearch && matchDate;
    });

    // B. Сортировка
    result.sort((a, b) => {
      const dateA = new Date(a.published_date || a.date_created).getTime();
      const dateB = new Date(b.published_date || b.date_created).getTime();
      
      return sortOrder === 'desc' 
        ? dateB - dateA  // Сначала новые
        : dateA - dateB; // Сначала старые
    });

    return result;
  }, [articles, searchQuery, selectedCategory, startDate, endDate, sortOrder]);

  // Сброс всех фильтров
  const resetAll = () => {
    setSearchQuery('');
    setSelectedCategory('Все');
    setStartDate('');
    setEndDate('');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-8">
      
      {/* --- ПАНЕЛЬ УПРАВЛЕНИЯ --- */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-6">
        
        {/* ВЕРХНИЙ РЯД: Поиск и Категории */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
          {/* Поле поиска */}
          <div className="relative w-full lg:w-1/3 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Поиск..."
              className="block w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
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

          {/* Табы категорий */}
          <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 w-full lg:w-auto scrollbar-hide">
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

        {/* НИЖНИЙ РЯД: Даты и Сортировка */}
        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center">
             
             {/* Выбор дат */}
             <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-slate-500 text-sm hidden md:inline">Период:</span>
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
                />
                <span className="text-slate-600">—</span>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
                />
             </div>

             {/* Сортировка и Сброс */}
             <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
                    className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                    <option value="desc">Сначала новые</option>
                    <option value="asc">Сначала старые</option>
                </select>

                {/* Кнопка сброса появляется если что-то выбрано */}
                {(startDate || endDate || searchQuery || selectedCategory !== 'Все') && (
                    <button 
                        onClick={resetAll}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                    >
                        <X size={14} /> Сбросить всё
                    </button>
                )}
             </div>
        </div>
      </div>

      {/* --- РЕЗУЛЬТАТЫ --- */}
      <div className="mb-4 text-right text-xs text-slate-500">
         Найдено: <span className="text-white font-bold">{filteredAndSortedArticles.length}</span>
      </div>

      {filteredAndSortedArticles.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
          <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl text-white font-medium">Ничего не найдено</h3>
          <p className="text-slate-500 mt-2">Попробуйте изменить параметры фильтрации.</p>
          <button 
              onClick={resetAll}
              className="mt-4 px-6 py-2 bg-sky-600/20 text-sky-400 rounded-lg hover:bg-sky-600 hover:text-white transition-all"
          >
             Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedArticles.map((post, index) => {
             // Используем правильную дату
             const displayDate = post.published_date || post.date_created;
             
             return (
                <Link 
                  key={`${post.id}-${index}`} 
                  href={`/news/${post.slug || post.id}`} 
                  className="group flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-sky-500/50 transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.1)] hover:-translate-y-1 h-full"
                >
                  {/* Картинка */}
                  <div className="h-52 overflow-hidden bg-slate-950 relative">
                    {post.image ? (
                      <Image 
                        src={getImageUrl(post.image) || ''} 
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <span className="text-4xl opacity-20">📰</span>
                      </div>
                    )}
                    
                    {/* Категория */}
                    {post.category && (
                        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider">
                        {post.category}
                        </div>
                    )}
                  </div>

                  {/* Контент */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-mono border-b border-white/5 pb-3">
                      <span className="flex items-center text-sky-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(displayDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    
                    <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-sky-400 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Теги */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                        {(Array.isArray(post.tags) ? post.tags : post.tags.toString().split(',')).slice(0, 3).map((tag: any, idx: number) => {
                          const tagName = typeof tag === 'string' ? tag.trim() : (tag.name || 'Tag');
                          return (
                            <span key={idx} className="flex items-center text-[9px] uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded">
                              <Tag className="w-3 h-3 mr-1 opacity-50" />
                              {tagName}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Link>
             );
          })}
        </div>
      )}
    </div>
  );
}