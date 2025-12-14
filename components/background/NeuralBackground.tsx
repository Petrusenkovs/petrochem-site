'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Компонент самих частиц
function Particles({ count = 60 }) {
  const meshRef = useRef<THREE.Points>(null);
  
  // Создаем случайные позиции и скорости один раз
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;   // Скорость
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [pos, vel];
  }, [count]);

  const linesGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  // Анимация каждый кадр
  useFrame(() => {
    if (!meshRef.current) return;

    const currentPositions = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    // 1. Двигаем частицы
    for (let i = 0; i < count; i++) {
      currentPositions[i * 3] += velocities[i * 3];
      currentPositions[i * 3 + 1] += velocities[i * 3 + 1];
      currentPositions[i * 3 + 2] += velocities[i * 3 + 2];

      // Если улетели далеко — разворачиваем
      if (Math.abs(currentPositions[i * 3]) > 15) velocities[i * 3] *= -1;
      if (Math.abs(currentPositions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;

    // 2. Рисуем линии между близкими частицами
    const linePositions: number[] = [];
    
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = currentPositions[i * 3] - currentPositions[j * 3];
        const dy = currentPositions[i * 3 + 1] - currentPositions[j * 3 + 1];
        const dz = currentPositions[i * 3 + 2] - currentPositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 3.5) { // Дистанция соединения
          linePositions.push(
            currentPositions[i * 3], currentPositions[i * 3 + 1], currentPositions[i * 3 + 2],
            currentPositions[j * 3], currentPositions[j * 3 + 1], currentPositions[j * 3 + 2]
          );
        }
      }
    }

    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#0ea5e9" // Цвет sky-500
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          color="#10b981" // Цвет emerald-500
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}

// Главный компонент фона
export default function NeuralBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]} // Поддержка Retina экранов
      >
        <Particles count={70} />
      </Canvas>
    </div>
  );
}