'use client';

import { useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from 'next-themes';

// Палитра цветов для групп (0-5)
const COLORS = [
  '#0ea5e9', // Sky (0)
  '#10b981', // Emerald (1)
  '#f59e0b', // Amber (2)
  '#8b5cf6', // Violet (3)
  '#ec4899', // Pink (4)
  '#6366f1', // Indigo (5)
];

interface KnowledgeGraphProps {
  data: { nodes: any[]; links: any[] };
  selectedNode?: string | null;
  onNodeClick?: (node: any) => void;
}

export default function KnowledgeGraph({ data, selectedNode, onNodeClick }: KnowledgeGraphProps) {
  const fgRef = useRef<any>(null);

  if (!data || !data.nodes || data.nodes.length === 0) return null;

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={data}
      cooldownTicks={100} // Оптимизация
      
      // --- ЦВЕТА СВЯЗЕЙ ---
      // Красим связь в цвет исходного узла, но делаем прозрачной
      linkWidth={(link: any) => link.value ? Math.sqrt(link.value) : 1}
      linkColor={(link: any) => {
          // Получаем группу исходного узла
          const sourceNode = link.source; 
          const group = sourceNode.group || 0;
          // Возвращаем цвет из палитры + прозрачность
          return `${COLORS[group % COLORS.length]}40`; // 40 = 25% opacity (hex)
      }}
      
      backgroundColor="#020617"

      // --- ОТРИСОВКА УЗЛОВ И ТЕКСТА (CANVAS) ---
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        // 1. Определяем базовые параметры
        const label = node.id;
        const fontSize = 12 / globalScale; // Шрифт уменьшается при отдалении
        const isSelected = node.id === selectedNode;
        
        // Выбираем цвет по группе
        const color = isSelected ? '#ffffff' : COLORS[node.group % COLORS.length];
        const radius = node.val ? Math.max(node.val, 2) : 2;

        // 2. Рисуем УЗЕЛ (Круг)
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();

        // Добавляем обводку, если выбран
        if (isSelected) {
            ctx.lineWidth = 2 / globalScale;
            ctx.strokeStyle = '#f43f5e';
            ctx.stroke();
        }

        // 3. Рисуем ТЕКСТ (Подпись)
        // Показываем текст, только если:
        // а) Мы сильно приблизили (globalScale > 1.5)
        // б) ИЛИ Узел очень важный (node.val > 5)
        // в) ИЛИ Узел выбран
        // г) ИЛИ Мышь наведена (hover) - сложно в 2d canvas без стейта, упростим:
        
        const showText = globalScale > 1.2 || node.val > 7 || isSelected;

        if (showText) {
            ctx.font = `${isSelected ? 'bold' : ''} ${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
            
            // Смещаем текст чуть ниже круга
            ctx.fillText(label, node.x, node.y + radius + fontSize);
        }
      }}

      // Интерактив
      onNodeClick={(node: any) => {
        fgRef.current?.centerAt(node.x, node.y, 1000);
        fgRef.current?.zoom(3, 2000);
        if (onNodeClick) onNodeClick(node);
      }}
    />
  );
}