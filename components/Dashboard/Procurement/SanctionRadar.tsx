'use client';

import { ShieldAlert, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SanctionAlert } from '@/lib/dashboard/types';
import { RISK_COLORS } from '@/lib/dashboard/constants';

interface SanctionRadarProps {
  sanctions: SanctionAlert[];
}

const RISK_LABELS = {
  critical: 'КРИТИЧЕСКОЕ',
  high: 'ВЫСОКИЙ РИСК',
  medium: 'СРЕДНИЙ РИСК',
  low: 'НИЗКИЙ РИСК',
};

const RISK_ICONS = {
  critical: '🚨',
  high: '⚠️',
  medium: '🆕',
  low: '✅',
};

export default function SanctionRadar({ sanctions }: SanctionRadarProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} часа назад`;
    }
    return 'вчера';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-bold text-white">Санкционный Радар</h3>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-400 transition-colors">
          <span>⚙️</span>
          <span>Настроить</span>
        </button>
      </div>

      <p className="text-sm text-slate-400 mb-4">
        Отслеживаемые поставщики: <span className="text-white font-medium">12 компаний</span>
      </p>

      {/* Alerts */}
      <div className="space-y-4">
        {sanctions.map((sanction) => {
          const colors = RISK_COLORS[sanction.riskLevel];

          return (
            <div key={sanction.id} className={cn('border rounded-xl p-4', colors.border)}>
              {/* Label */}
              <div className="flex items-center gap-2 mb-3">
                <span>{RISK_ICONS[sanction.riskLevel]}</span>
                <span className={cn('text-sm font-bold', colors.text)}>
                  {RISK_LABELS[sanction.riskLevel]} ({formatDate(sanction.date)})
                </span>
              </div>

              {/* Content */}
              <div className={cn('rounded-lg p-4', colors.bg)}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="text-white font-medium">{sanction.supplier}</h4>
                    <p className="text-sm text-slate-400">→ {sanction.listType}</p>
                  </div>
                  <span className="text-xs text-slate-500">{sanction.country}</span>
                </div>

                <p className="text-sm text-slate-400 mb-3">{sanction.description}</p>

                {sanction.affectedOrders.length > 0 && (
                  <p className="text-sm text-orange-400 mb-3">
                    ⚠️ Ваши заказы под риском: {sanction.affectedOrders.join(', ')}
                  </p>
                )}

                {sanction.affectedOrders.length === 0 && (
                  <p className="text-sm text-green-400 mb-3">✅ Ваши активные заказы: не затронуты</p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm text-slate-300 transition-colors">
                    <span>Подробнее</span>
                  </button>
                  {sanction.alternatives.length > 0 && (
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 rounded-lg text-sm text-sky-400 transition-colors">
                      <Search className="w-3 h-3" />
                      <span>Найти альтернативу</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
