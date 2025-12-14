'use client';

import { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GraphNode, GraphLink } from '@/lib/graph';

// Функция расстановки точек на сфере (Фибоначчи)
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

function Scene({ data }: { data: { nodes: GraphNode[], links: GraphLink[] } }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  // 1. Вычисляем координаты для каждого тега один раз
  const layout = useMemo(() => {
    const coords = getSphereCoordinates(data.nodes.length, 12);
    const nodeMap = new Map();
    
    data.nodes.forEach((node, i) => {
      nodeMap.set(node.id, coords[i]);
    });

    return { coords, nodeMap };
  }, [data]);

  // Медленное вращение всего облака
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Рисуем СВЯЗИ (Линии) */}
      {data.links.map((link, i) => {
        const start = layout.nodeMap.get(link.source);
        const end = layout.nodeMap.get(link.target);
        
        if (!start || !end) return null;

        // Логика подсветки:
        // Если ничего не выделено -> линии прозрачные (0.1)
        // Если наведен тег -> подсвечиваем только его связи
        const isConnected = hoveredNode && (link.source === hoveredNode || link.target === hoveredNode);
        const isHidden = hoveredNode && !isConnected;

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color={isConnected ? "#0ea5e9" : "#10b981"} 
              transparent 
              opacity={isConnected ? 0.8 : (isHidden ? 0.02 : 0.1)} 
            />
          </line>
        );
      })}

      {/* Рисуем ТЕГИ (Текст + Точки) */}
      {data.nodes.map((node) => {
        const pos = layout.nodeMap.get(node.id);
        const isHovered = hoveredNode === node.id;
        const isDimmed = hoveredNode && hoveredNode !== node.id;

        return (
          <group key={node.id} position={pos}>
            {/* Точка узла */}
            <mesh 
              onPointerOver={(e) => { e.stopPropagation(); setHoveredNode(node.id); }}
              onPointerOut={() => setHoveredNode(null)}
              onClick={() => console.log("Clicked:", node.id)} // Тут можно добавить переход на страницу поиска
            >
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial 
                color={isHovered ? "#0ea5e9" : "#ffffff"} 
                emissive={isHovered ? "#0ea5e9" : "#000000"}
                emissiveIntensity={2}
              />
            </mesh>

            {/* Текст тега */}
            <Text
              position={[0, 0.4, 0]}
              fontSize={isHovered ? 0.8 : 0.5}
              color={isHovered ? "#0ea5e9" : (isDimmed ? "#475569" : "#cbd5e1")}
              anchorX="center"
              anchorY="middle"
            >
              {node.id}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export default function KnowledgeGraph({ data }: { data: { nodes: GraphNode[], links: GraphLink[] } }) {
  if (data.nodes.length === 0) {
      return (
          <div className="flex items-center justify-center h-full text-slate-500">
              Нет данных для построения графа. Добавьте теги в статьи.
          </div>
      )
  }

  return (
    <div className="w-full h-[80vh] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 relative">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <h2 className="text-white font-bold text-xl">Нейросеть Знаний</h2>
          <p className="text-slate-400 text-sm">Вращайте и наводите на узлы</p>
      </div>
      <Canvas camera={{ position: [0, 0, 25], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene data={data} />
        <OrbitControls enableZoom={true} autoRotate={false} />
      </Canvas>
    </div>
  );
}