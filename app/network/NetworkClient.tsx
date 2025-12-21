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
    // Используем 100dvh для корректной работы на iPhone/Android
    <div className="flex flex-col lg:flex-row h-[100dvh] w-screen bg-slate-950 overflow-hidden">
      
      {/* 1. ГРАФ (СВЕРХУ на моб / СЛЕВА на ПК) */}
      <div className={`
          relative transition-all duration-300 ease-in-out w-full
          /* Mobile: Если открыто - 35% высоты, если нет - 100% */
          ${selectedNode ? 'h-[35%]' : 'h-full'} 
          /* Desktop: Всегда полная высота, гибкая ширина */
          lg:h-full lg:flex-1
      `}>
        <KnowledgeGraph 
          data={data} 
          selectedNode={selectedNode} 
          onNodeClick={handleNodeClick} 
        />
      </div>

      {/* 2. САЙДБАР (СНИЗУ на моб / СПРАВА на ПК) */}
      <div className={`
          bg-slate-900 border-t border-slate-800 lg:border-t-0 lg:border-l z-20 shadow-2xl
          flex flex-col transition-all duration-300 ease-in-out
          
          /* Mobile: Высота меняется с 0 до 65% */
          w-full
          ${selectedNode ? 'h-[65%]' : 'h-0'}

          /* Desktop: Высота всегда 100%, ширина меняется */
          lg:h-full 
          lg:w-auto
          ${selectedNode ? 'lg:w-[450px]' : 'lg:w-0'}
      `}>
        
        {/* Обертка нужна для корректной работы скрытия контента при анимации */}
        <div className={`w-full h-full overflow-hidden ${selectedNode ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
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