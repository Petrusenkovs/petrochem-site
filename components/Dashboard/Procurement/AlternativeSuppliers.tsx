'use client';

import { Globe, Star, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Supplier } from '@/lib/dashboard/types';

interface AlternativeSuppliersProps {
  suppliers: Supplier[];
  title?: string;
}

const JURISDICTION_LABELS = {
  friendly: { text: 'Дружественная юрисдикция', color: 'text-green-400' },
  neutral: { text: 'Нейтральная юрисдикция', color: 'text-yellow-400' },
  restricted: { text: 'Ограниченная юрисдикция', color: 'text-red-400' },
};

export default function AlternativeSuppliers({ suppliers, title = 'Альтернативные поставщики' }: AlternativeSuppliersProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'w-3 h-3',
              star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
            )}
          />
        ))}
        <span className="text-xs text-slate-400 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>

      {/* Subtitle */}
      <p className="text-sm text-slate-400 mb-4">
        Для замены: <span className="text-white">Linde Engineering (теплообменники)</span>
      </p>

      {/* Suppliers list */}
      <div className="space-y-4">
        {suppliers.filter(s => s.isAlternative).slice(0, 3).map((supplier, index) => {
          const jurisdictionInfo = JURISDICTION_LABELS[supplier.jurisdictionStatus];

          return (
            <div
              key={supplier.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-500">{index + 1}.</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{supplier.countryFlag}</span>
                      <h4 className="text-white font-medium">{supplier.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500">{supplier.country}</p>
                  </div>
                </div>
                {renderStars(supplier.rating)}
              </div>

              {/* Status */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={cn('text-xs', jurisdictionInfo.color)}>
                  ✓ {jurisdictionInfo.text}
                </span>
                {supplier.priceAdvantage && (
                  <span className="text-xs text-green-400">
                    💰 Цена: {supplier.priceAdvantage}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>📊</span>
                  <span>{supplier.notes}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>Сроки: {supplier.leadTime}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm text-white transition-colors">
                  <FileText className="w-3 h-3" />
                  <span>Запросить КП</span>
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-300 transition-colors">
                  <span>Сохранить</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
