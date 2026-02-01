'use client';

import { Bot, Lightbulb } from 'lucide-react';
import { AISummaryData } from '@/lib/dashboard/types';

interface AISummaryProps {
  summary: AISummaryData;
}

export default function AISummary({ summary }: AISummaryProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold text-white">AI Резюме на сегодня</h3>
      </div>

      <p className="text-xs text-slate-500 mb-4">Обновлено: {formatDate(summary.date)}</p>

      {/* Summary text */}
      <p className="text-sm text-slate-300 leading-relaxed mb-6">{summary.summary}</p>

      {/* Recommendations */}
      <div className="bg-slate-950/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-sm font-medium text-white">Рекомендации:</h4>
        </div>

        <ul className="space-y-2">
          {summary.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-sky-400 mt-0.5">•</span>
              <span className="text-slate-400">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
