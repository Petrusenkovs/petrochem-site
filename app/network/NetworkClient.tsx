'use client';

import { useState } from 'react';
import KnowledgeGraph from '@/components/background/KnowledgeGraph';
import NetworkSidebar from '@/components/Network/NetworkSidebar';

export default function NetworkClient({ data }: { data: any }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (id: string | null) => {
    setSelectedNode(prev => prev === id ? null : id);
  };

  return (
    // Используем 100dvh для гарантии полного экрана на мобильных
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full bg-slate-950 overflow-hidden relative">
      
      {/* 1. ГРАФ */}
      <div className={`
          relative w-full transition-all duration-300 ease-out
          
          /* MOBILE: Управляем высотой через dvh. 
             Если открыто - 35% экрана, если нет - весь экран. */
          ${selectedNode ? 'h-[35dvh]' : 'h-[100dvh]'}
          
          /* DESKTOP: Всегда flex-1 (занимает всё доступное место) */
          lg:h-full lg:flex-1
      `}>
        <KnowledgeGraph 
          data={data} 
          selectedNode={selectedNode} 
          onNodeClick={handleNodeClick} 
        />
      </div>

      {/* 2. САЙДБАР (BOTTOM SHEET) */}
      <div className={`
          /* MOBILE: FIXED POSITION (Самое стабильное решение) */
          fixed inset-x-0 bottom-0 z-30
          w-full
          bg-slate-900 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]
          
          /* Анимация выезда снизу */
          transition-transform duration-300 ease-out
          ${selectedNode ? 'translate-y-0' : 'translate-y-full'}
          
          /* Высота на мобильном - 65% реальной высоты экрана */
          h-[65dvh]

          /* DESKTOP: Возвращаем в нормальный поток (Static) */
          lg:static lg:transform-none
          lg:h-full lg:border-t-0 lg:border-l
          lg:transition-all lg:duration-300
          
          /* Ширина на десктопе: */
          lg:w-auto
          ${selectedNode ? 'lg:w-[450px]' : 'lg:w-0'}
      `}>
        
        {/* Контейнер для контента с поддержкой opacity при анимации */}
        <div className={`w-full h-full ${selectedNode ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 delay-100`}>
             <NetworkSidebar 
                nodeId={selectedNode} 
                // @ts-ignore
                onClose={() => setSelectedNode(null)} 
            />
        </div>
      </div>

    </div>
  );
}