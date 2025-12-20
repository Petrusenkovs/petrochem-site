'use client';

import { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Billboard, Line } from '@react-three/drei';
import * as THREE from 'three';
import { GraphNode, GraphLink } from '@/lib/graph';

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function getSphereCoordinates(count: number, radius: number = 10) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); 
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }
  return points;
}

// --- СЦЕНА ---
interface SceneProps {
  data: { nodes: GraphNode[], links: GraphLink[] };
  selectedNode: string | null;
  onNodeClick?: (id: string | null) => void;
}

function Scene({ data, selectedNode, onNodeClick }: SceneProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // 1. Расчет координат (мемоизация, чтобы не считать каждый кадр)
  const layout = useMemo(() => {
    if (!data.nodes.length) return { coords: [], nodeMap: new Map() };
    const coords = getSphereCoordinates(data.nodes.length, 12);
    const nodeMap = new Map();
    data.nodes.forEach((node, i) => nodeMap.set(node.id, coords[i]));
    return { coords, nodeMap };
  }, [data]);

  // 2. ВРАЩЕНИЕ
  useFrame((state, delta) => {
    // Вращаем только если НИЧЕГО НЕ ВЫБРАНО
    // Если selectedNode есть, граф замрет
    if (groupRef.current && !selectedNode) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* --- ЛИНИИ --- */}
      {data.links.map((link, i) => {
        const start = layout.nodeMap.get(link.source);
        const end = layout.nodeMap.get(link.target);
        if (!start || !end) return null;

        const isHoveredLink = hoveredNode && (link.source === hoveredNode || link.target === hoveredNode);
        const isSelectedLink = selectedNode && (link.source === selectedNode || link.target === selectedNode);
        const isActive = isHoveredLink || isSelectedLink;
        
        // Затемнение неактивных связей
        const somethingIsActive = hoveredNode || selectedNode;
        const isDimmed = somethingIsActive && !isActive;

        const weight = link.value || 1;
        const lineWidth = Math.min(0.5 + (weight * 0.5), 3);

        // Цвета
        let linkColor = "#10b981"; // Зеленый (обычный)
        if (isSelectedLink) linkColor = "#f59e0b"; // Оранжевый (выбрано)
        else if (isHoveredLink) linkColor = "#38bdf8"; // Голубой (ховер)

        return (
          <Line
            key={i}
            points={[start, end]}
            color={linkColor}
            lineWidth={lineWidth}
            transparent
            opacity={isActive ? 0.8 : (isDimmed ? 0.05 : Math.min(0.1 + (weight * 0.1), 0.5))}
            depthWrite={false}
          />
        );
      })}

      {/* --- УЗЛЫ --- */}
      {data.nodes.map((node) => {
        const pos = layout.nodeMap.get(node.id);
        if (!pos) return null;

        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode === node.id;
        const somethingIsActive = hoveredNode || selectedNode;
        const isDimmed = somethingIsActive && !isHovered && !isSelected;

        const baseSize = 0.2 + (Math.log2((node.val || 0) + 2) * 0.1);
        const size = (isHovered || isSelected) ? baseSize * 1.5 : baseSize;

        // Цвета
        let nodeColor = "#ffffff";
        let emissiveColor = "#000000";
        
        if (isSelected) {
            nodeColor = "#f59e0b"; // Оранжевый (Selected)
            emissiveColor = "#f59e0b";
        } else if (isHovered) {
            nodeColor = "#0ea5e9"; // Голубой (Hover)
            emissiveColor = "#0ea5e9";
        }

        return (
          <group key={node.id} position={pos}>
            <mesh 
              onPointerOver={(e) => { 
                e.stopPropagation(); 
                setHoveredNode(node.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredNode(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onNodeClick) onNodeClick(node.id);
              }}
            >
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial 
                color={nodeColor}
                emissive={emissiveColor}
                emissiveIntensity={(isHovered || isSelected) ? 2 : 0}
                transparent
                opacity={isDimmed ? 0.2 : 1}
              />
            </mesh>

            <Billboard position={[0, size + 0.2, 0]} follow={true}>
              <Text
                fontSize={(isHovered || isSelected) ? 0.7 : 0.45}
                color={(isHovered || isSelected) ? nodeColor : (isDimmed ? "#334155" : "#e2e8f0")}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#0f172a"
              >
                {node.id}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

// --- MAIN COMPONENT ---
interface KnowledgeGraphProps {
    data: { nodes: GraphNode[], links: GraphLink[] };
    selectedNode?: string | null;
    onNodeClick?: (id: string | null) => void;
}

export default function KnowledgeGraph({ data, selectedNode = null, onNodeClick }: KnowledgeGraphProps) {
  if (!data || !data.nodes || data.nodes.length === 0) {
      return (
          <div className="w-full h-[600px] flex items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-500">
              Нет данных для построения графа.
          </div>
      )
  }

  return (
    <div className="w-full h-[600px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative shadow-2xl">
      <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
          <h2 className="text-white font-bold text-xl drop-shadow-md">Knowledge Graph</h2>
          <p className="text-slate-400 text-sm drop-shadow-md">
             {selectedNode ? 'Режим просмотра связей' : 'Кликните на узел для деталей'}
          </p>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 32], fov: 45 }} 
        dpr={[1, 2]}
        // Сброс при клике в пустоту
        onPointerMissed={() => {
            if (onNodeClick) onNodeClick(null);
        }}
      > 
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0ea5e9" />

        <Scene 
            data={data} 
            selectedNode={selectedNode} 
            onNodeClick={onNodeClick} 
        />
        
        <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            minDistance={10}
            maxDistance={60}
            // Отключаем авто-вращение контролов, так как мы вращаем саму группу вручную
            autoRotate={false} 
        />
      </Canvas>
    </div>
  );
}