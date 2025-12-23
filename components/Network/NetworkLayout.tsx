'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import NetworkSidebar from './NetworkSidebar'; 

// Динамический импорт (2D версия)
const KnowledgeGraph = dynamic(() => import('@/components/background/KnowledgeGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950">
      <div className="text-sky-500 animate-pulse text-sm">Загрузка данных...</div>
    </div>
  )
});

// Категории (должны совпадать с частью названия тегов или быть в них)
const CATEGORIES = ['Все', 'Modeling', 'Technology', 'Safety', 'Projects', 'Equipment'];

interface NetworkLayoutProps {
  data: {
    nodes: any[];
    links: any[];
  };
}

export default function NetworkLayout({ data }: NetworkLayoutProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Все');

  // --- ИСПРАВЛЕННАЯ ЛОГИКА ФИЛЬТРАЦИИ ---
  const filteredData = useMemo(() => {
    // 1. Если "Все", отдаем оригинал
    if (activeCategory === 'Все') {
      return data;
    }

    const searchObj = activeCategory.toLowerCase();

    // 2. Находим "Ядра" - узлы, которые напрямую содержат искомое слово
    const coreNodeIds = new Set<string>();
    data.nodes.forEach((n: any) => {
        if (n.id.toLowerCase().includes(searchObj)) {
            coreNodeIds.add(n.id);
        }
    });

    // Если ничего не нашли по названию, возвращаем пустой граф
    if (coreNodeIds.size === 0) {
        return { nodes: [], links: [] };
    }

    // 3. Находим связи и соседей
    // Мы оставляем связь, если ХОТЯ БЫ ОДИН из её концов — это "Ядро"
    const validLinks: any[] = [];
    const visibleNodeIds = new Set<string>(coreNodeIds); // Начинаем с ядер

    data.links.forEach((link: any) => {
       // ВАЖНО: D3 может мутировать link.source в объект, поэтому проверяем оба варианта
       const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
       const targetId = typeof link.target === 'object' ? link.target.id : link.target;
       
       const sourceIsCore = coreNodeIds.has(sourceId);
       const targetIsCore = coreNodeIds.has(targetId);

       // Если связь касается нашей темы (хотя бы с одной стороны)
       if (sourceIsCore || targetIsCore) {
           validLinks.push(link);
           // Добавляем обоих участников связи в видимые узлы
           // (это добавит соседей, у которых в названии нет 'Safety', но они связаны с ним)
           visibleNodeIds.add(sourceId);
           visibleNodeIds.add(targetId);
       }
    });

    // 4. Фильтруем узлы на основе собранного списка видимых ID
    const validNodes = data.nodes.filter((n: any) => visibleNodeIds.has(n.id));

    return { nodes: validNodes, links: validLinks };

  }, [data, activeCategory]);

  const activeNodesCount = filteredData.nodes.length;
  const activeLinksCount = filteredData.links.length;

  const handleNodeClick = useCallback((node: any) => {
      const id = typeof node === 'string' ? node : (node?.id || null);
      setSelectedNode(prev => prev === id ? null : id);
  }, []);

  const handleCloseSidebar = useCallback(() => {
      setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen pt-14 lg:pt-16 bg-slate-950 overflow-hidden">
      
      {/* --- САЙДБАР --- */}
      <aside className="
          order-2 md:order-1
          w-full md:w-[400px] lg:w-[450px] shrink-0
          h-[45%] md:h-full
          border-t md:border-t-0 md:border-r border-slate-800
          bg-slate-900
          relative z-20 shadow-2xl
      ">
        <NetworkSidebar 
            nodeId={selectedNode} 
            onClose={handleCloseSidebar} 
        />
      </aside>

      {/* --- ОБЛАСТЬ ГРАФА --- */}
      <section className="
          order-1 md:order-2
          flex-1 
          h-[55%] md:h-full
          relative
          bg-slate-950
          z-10
          overflow-hidden
      ">
        {/* --- ПАНЕЛЬ ФИЛЬТРОВ --- */}
        <div className="absolute top-4 left-0 right-0 z-30 flex justify-center pointer-events-none">
            <div className="flex gap-2 p-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl pointer-events-auto overflow-x-auto max-w-[90vw] scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
                            px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap
                            ${activeCategory === cat 
                                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' 
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Статистика */}
        <div className="absolute bottom-4 right-4 z-30 flex gap-3 pointer-events-none select-none">
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg px-3 py-1 text-[10px] text-slate-500">
                Nodes: <span className="text-sky-400 font-mono">{activeNodesCount}</span>
            </div>
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-lg px-3 py-1 text-[10px] text-slate-500">
                Links: <span className="text-emerald-400 font-mono">{activeLinksCount}</span>
            </div>
        </div>

        {/* 2D ГРАФ */}
        <div className="w-full h-full bg-slate-950 cursor-grab active:cursor-grabbing">
           <KnowledgeGraph 
              data={filteredData}
              selectedNode={selectedNode}
              onNodeClick={handleNodeClick} 
           />
        </div>
      </section>

    </div>
  );
}