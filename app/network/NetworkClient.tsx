'use client';

import { useState } from 'react';
import KnowledgeGraph from '@/components/background/KnowledgeGraph';
import NetworkSidebar from '@/components/Network/NetworkSidebar';

export default function NetworkClient({ data }: { data: any }) {
  // Состояние: какой узел сейчас выбран
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Функция клика с логикой "Тумблера":
  // Если кликнули на уже выбранный узел — снимаем выделение.
  // Если на новый — выбираем его.
  const handleNodeClick = (id: string | null) => {
    if (selectedNode === id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(id);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* 1. ГРАФ
         ВАЖНО: Я добавил проп `selectedNode={selectedNode}`. 
         Теперь граф знает, что нужно остановить вращение и подсветить узел оранжевым.
      */}
      <KnowledgeGraph 
        data={data} 
        selectedNode={selectedNode}   // <-- ЭТО КЛЮЧЕВОЕ ИЗМЕНЕНИЕ
        onNodeClick={handleNodeClick} // Передаем улучшенную функцию
      />

      {/* 2. САЙДБАР
         Если в твоем NetworkSidebar есть проп onClose (для крестика), это будет работать идеально.
      */}
      <NetworkSidebar 
        nodeId={selectedNode} 
        // @ts-ignore — на случай, если в sidebar еще не прописан тип для onClose
        onClose={() => setSelectedNode(null)} 
      />
    </div>
  );
}