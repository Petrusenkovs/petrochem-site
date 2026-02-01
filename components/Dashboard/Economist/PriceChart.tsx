'use client';

import { useMemo } from 'react';
import { PriceData } from '@/lib/dashboard/types';

interface PriceChartProps {
  prices: PriceData[];
}

export default function PriceChart({ prices }: PriceChartProps) {
  // Use ПНД and ПП for the chart
  const pndData = prices.find((p) => p.code === 'PND_PP');
  const ppData = prices.find((p) => p.code === 'PP_RU');

  const chartData = useMemo(() => {
    if (!pndData || !ppData) return null;

    const allValues = [...pndData.history.map((p) => p.value), ...ppData.history.map((p) => p.value)];
    const minValue = Math.min(...allValues) * 0.95;
    const maxValue = Math.max(...allValues) * 1.05;
    const range = maxValue - minValue;

    const width = 700;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xStep = chartWidth / (pndData.history.length - 1);

    const pndPoints = pndData.history.map((point, index) => {
      const x = padding.left + index * xStep;
      const y = padding.top + chartHeight - ((point.value - minValue) / range) * chartHeight;
      return { x, y, value: point.value, date: point.date };
    });

    const ppPoints = ppData.history.map((point, index) => {
      const x = padding.left + index * xStep;
      const y = padding.top + chartHeight - ((point.value - minValue) / range) * chartHeight;
      return { x, y, value: point.value, date: point.date };
    });

    return {
      pndPoints,
      ppPoints,
      minValue,
      maxValue,
      width,
      height,
      padding,
      chartWidth,
      chartHeight,
    };
  }, [pndData, ppData]);

  if (!chartData || !pndData || !ppData) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-[280px] flex items-center justify-center">
        <p className="text-slate-500">Нет данных для графика</p>
      </div>
    );
  }

  const pndPath = chartData.pndPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const ppPath = chartData.ppPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Динамика Цен: ПНД и ПП (СРТ Москва)</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-500" />
            <span className="text-xs text-slate-400">ПНД ПП</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-400">ПП (РФ)</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${chartData.width} ${chartData.height}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartData.padding.top + chartData.chartHeight * (1 - ratio);
          const value = chartData.minValue + (chartData.maxValue - chartData.minValue) * ratio;
          return (
            <g key={ratio}>
              <line
                x1={chartData.padding.left}
                y1={y}
                x2={chartData.padding.left + chartData.chartWidth}
                y2={y}
                stroke="#334155"
                strokeDasharray="4 4"
              />
              <text x={chartData.padding.left - 10} y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px]">
                {Math.round(value / 1000)}k
              </text>
            </g>
          );
        })}

        {/* X axis labels */}
        {chartData.pndPoints.map((point, index) => {
          if (index % 2 !== 0 && index !== chartData.pndPoints.length - 1) return null;
          const date = new Date(point.date);
          const label = `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
          return (
            <text
              key={index}
              x={point.x}
              y={chartData.height - 8}
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              {label}
            </text>
          );
        })}

        {/* ПНД line */}
        <path d={pndPath} fill="none" stroke="#0ea5e9" strokeWidth="2" />

        {/* ПП line */}
        <path d={ppPath} fill="none" stroke="#10b981" strokeWidth="2" />

        {/* Current value markers */}
        <circle
          cx={chartData.pndPoints[chartData.pndPoints.length - 1].x}
          cy={chartData.pndPoints[chartData.pndPoints.length - 1].y}
          r="4"
          fill="#0ea5e9"
        />
        <circle
          cx={chartData.ppPoints[chartData.ppPoints.length - 1].x}
          cy={chartData.ppPoints[chartData.ppPoints.length - 1].y}
          r="4"
          fill="#10b981"
        />
      </svg>

      {/* Forecast */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <p className="text-sm text-slate-400">
          <span className="text-white font-medium">Прогноз на 01.02:</span>{' '}
          ПП: <span className="text-emerald-400">129,000+ ₽/т</span> | ПНД:{' '}
          <span className="text-sky-400">120,500+ ₽/т</span>
        </p>
      </div>
    </div>
  );
}
