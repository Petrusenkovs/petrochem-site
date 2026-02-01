'use client';

import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceData } from '@/lib/dashboard/types';

interface PriceCardProps {
  price: PriceData;
}

export default function PriceCard({ price }: PriceCardProps) {
  const isUp = price.trend === 'up';
  const isDown = price.trend === 'down';

  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  const formatPrice = (value: number, unit: string) => {
    if (unit === '₽/т') {
      return new Intl.NumberFormat('ru-RU').format(value);
    }
    if (unit === '$/барр.') {
      return value.toFixed(2);
    }
    return value.toString();
  };

  return (
    <div
      className={cn(
        'bg-slate-900/60 border rounded-2xl p-4 transition-all',
        isUp && 'border-green-500/30 hover:border-green-500/50',
        isDown && 'border-red-500/30 hover:border-red-500/50',
        !isUp && !isDown && 'border-slate-800 hover:border-slate-700'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-400">{price.name}</span>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium',
            isUp && 'bg-green-500/20 text-green-400',
            isDown && 'bg-red-500/20 text-red-400',
            !isUp && !isDown && 'bg-slate-500/20 text-slate-400'
          )}
        >
          <TrendIcon className="w-3 h-3" />
          <span>
            {isUp ? '+' : isDown ? '' : ''}
            {price.change.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white">
          {formatPrice(price.currentPrice, price.unit)}
        </span>
        <span className="text-sm text-slate-500">{price.unit}</span>
      </div>

      {/* Mini sparkline */}
      <div className="h-8 flex items-end gap-0.5">
        {price.history.slice(-7).map((point, index) => {
          const max = Math.max(...price.history.map((p) => p.value));
          const min = Math.min(...price.history.map((p) => p.value));
          const range = max - min || 1;
          const height = ((point.value - min) / range) * 100;

          return (
            <div
              key={index}
              className={cn(
                'flex-1 rounded-t transition-all',
                isUp ? 'bg-green-500/40' : isDown ? 'bg-red-500/40' : 'bg-slate-600/40',
                index === price.history.length - 1 &&
                  (isUp ? 'bg-green-500' : isDown ? 'bg-red-500' : 'bg-slate-500')
              )}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>

      {/* Special note for logistics */}
      {price.code === 'LOGISTICS' && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-orange-400">
          <Clock className="w-3 h-3" />
          <span>Задержка</span>
        </div>
      )}
    </div>
  );
}
