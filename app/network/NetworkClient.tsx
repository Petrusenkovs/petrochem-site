'use client';

import { useState } from 'react';
import KnowledgeGraph from '@/components/background/KnowledgeGraph';
import NetworkSidebar from '@/components/Network/NetworkSidebar';

export default function NetworkClient({ data }: { data: any }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (id: string | null) => {
    if (selectedNode === id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(id);
    }
  };

  return (
    // ГЛАВНЫЙ КОНТЕЙНЕР: Занимает весь экран (100vh)
    // Mobile: flex-col (вертикальный стек)
    // Desktop: flex-row (горизонтальный ряд)
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-slate-950 overflow-hidden">
      
      {/* 1. БЛОК ГРАФА 
          Он всегда есть. Но меняет размер.
      */}
      <div className={`
          relative transition-all duration-500 ease-in-out w-full
          /* МОБИЛЬНЫЙ РЕЖИМ (по умолчанию): */
          ${selectedNode ? 'h-[35vh]' : 'h-full'} 
          
          /* ДЕСКТОП РЕЖИМ (lg): */
          lg:h-full lg:flex-1
      `}>
        <KnowledgeGraph 
          data={data} 
          selectedNode={selectedNode} 
          onNodeClick={handleNodeClick} 
        />
      </div>

      {/* 2. БЛОК САЙДБАРА
          Он открывается снизу на телефоне и справа на ПК.
      */}
      <div className={`
          bg-slate-900 border-slate-800 z-20 shadow-2xl overflow-hidden flex flex-col
          transition-all duration-500 ease-in-out
          
          /* ГРАНИЦЫ */
          border-t lg:border-t-0 lg:border-l

          /* РАЗМЕРЫ НА МОБИЛЬНОМ (изменяем высоту h) */
          w-full
          ${selectedNode ? 'h-[65vh]' : 'h-0'}

          /* РАЗМЕРЫ НА ДЕСКТОПЕ (изменяем ширину w, высота всегда full) */
          lg:h-full 
          lg:w-auto /* сброс мобильной ширины */
          ${selectedNode ? 'lg:w-[480px]' : 'lg:w-0'}
      `}>
        
        {/* Внутренний контейнер для скролла */}
        <div className="h-full w-full overflow-y-auto relative bg-slate-900">
            
            {/* Кнопка закрытия для мобилок (чтобы было удобно закрыть пальцем) */}
            <button 
                onClick={() => setSelectedNode(null)}
                className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white"
            >
                ✕
            </button>

            {/* Контент с задержкой появления (чтобы не мелькал при открытии) */}
            <div className={`
                h-full w-full
                transition-opacity duration-300 delay-100
                ${selectedNode ? 'opacity-100' : 'opacity-0'}
            `}>
                <NetworkSidebar 
                    nodeId={selectedNode} 
                    // @ts-ignore
                    onClose={() => setSelectedNode(null)} 
                />
            </div>
        </div>
      </div>

    </div>
  );
}