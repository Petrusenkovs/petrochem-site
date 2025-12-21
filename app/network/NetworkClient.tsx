'use client';

import { useState } from 'react';
import KnowledgeGraph from '@/components/background/KnowledgeGraph';
import NetworkSidebar from '@/components/Network/NetworkSidebar';

export default function NetworkClient({ data }: { data: any }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (id: string | null) => {
    // Если кликнули по уже выбранному — закрываем
    if (selectedNode === id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(id);
    }
  };

  return (
    // ГЛАВНЫЙ КОНТЕЙНER
    // Mobile: flex-col (вертикально) | Desktop: flex-row (горизонтально)
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-950 overflow-hidden">
      
      {/* 1. БЛОК ГРАФА (ЛЕВЫЙ / ВЕРХНИЙ) 
        Он занимает всё свободное место (flex-1).
        Но если выбран узел (selectedNode), мы немного поджимаем его высоту на мобилках,
        чтобы он не исчез полностью.
      */}
      <div className={`
          relative transition-all duration-500 ease-in-out
          /* Логика размеров: */
          ${selectedNode 
            ? 'h-[40vh] lg:h-full lg:flex-1' // Если открыто: на мобиле 40% высоты, на ПК всё оставшееся место
            : 'h-full w-full flex-1'         // Если закрыто: полная высота и ширина
          }
      `}>
        <KnowledgeGraph 
          data={data} 
          selectedNode={selectedNode} 
          onNodeClick={handleNodeClick} 
        />
      </div>

      {/* 2. БЛОК САЙДБАРА (ПРАВЫЙ / НИЖНИЙ)
        Анимация через изменение ширины (width) на ПК и высоты (height) на мобиле.
      */}
      <div className={`
          bg-slate-900 border-slate-800 z-20 shadow-2xl overflow-hidden
          transition-all duration-500 ease-in-out
          flex flex-col

          /* ГРАНИЦЫ: На мобиле линия сверху, на ПК линия слева */
          border-t lg:border-t-0 lg:border-l

          /* РАЗМЕРЫ (Анимация открытия) */
          ${selectedNode
             ? 'h-[60vh] lg:h-full lg:w-[480px]'  // ОТКРЫТО: Мобила 60% высоты, ПК фикс ширина
             : 'h-0 lg:h-full lg:w-0'              // ЗАКРЫТО: Высота 0 (моб) или Ширина 0 (ПК)
          }
      `}>
        {/* Контейнер для контента с прокруткой */}
        <div className="h-full w-full overflow-y-auto relative">
            
            {/* Кнопка закрытия (дублируем тут для удобства на мобилах) */}
            <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 z-50 text-slate-400 hover:text-white p-2 bg-slate-800/50 rounded-full lg:hidden"
            >
                ✕
            </button>

            {/* Сам компонент новостей */}
            {/* Добавляем проверку, чтобы не рендерить контент, пока ширина 0 (оптимизация) */}
            <div className={`${selectedNode ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 delay-200`}>
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