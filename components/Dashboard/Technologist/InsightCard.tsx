'use client';

import { FileText, ScrollText, Building2, Users, ExternalLink, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIInsight } from '@/lib/dashboard/types';
import { RELEVANCE_COLORS } from '@/lib/dashboard/constants';

const SOURCE_ICONS = {
  patent: ScrollText,
  article: FileText,
  case: Building2,
  conference: Users,
};

interface InsightCardProps {
  insight: AIInsight;
  featured?: boolean;
}

export default function InsightCard({ insight, featured = false }: InsightCardProps) {
  const relevanceColors = RELEVANCE_COLORS[insight.relevance];
  const SourceIcon = SOURCE_ICONS[insight.sourceType];

  if (featured) {
    return (
      <div className={cn(
        'border-2 rounded-2xl p-6 mb-6',
        relevanceColors.border,
        'bg-slate-900/80'
      )}>
        {/* Relevance badge */}
        <div className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold mb-4',
          relevanceColors.bg,
          relevanceColors.text
        )}>
          <span>🔥</span>
          <span>ВЫСОКАЯ РЕЛЕВАНТНОСТЬ ({insight.relevancePercent}%)</span>
        </div>

        {/* Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn('p-2 rounded-lg', relevanceColors.bg)}>
            <SourceIcon className={cn('w-5 h-5', relevanceColors.text)} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-1">{insight.title}</h4>
            <p className="text-sm text-slate-400">{insight.source}</p>
          </div>
        </div>

        {/* Goal link */}
        {insight.linkedGoalTitle && (
          <p className="text-sm text-slate-400 mb-4">
            Связь с вашей Целью: <span className="text-sky-400">&quot;{insight.linkedGoalTitle}&quot;</span>
          </p>
        )}

        {/* Key points */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-300 mb-2">💡 Ключевые выводы:</p>
          <ul className="space-y-1.5">
            {insight.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                <span className="text-sky-400 mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm font-medium text-white transition-colors">
            <FileText className="w-4 h-4" />
            <span>Читать резюме</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-slate-300 transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span>Полный патент</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-slate-300 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span>Сохранить</span>
          </button>
        </div>
      </div>
    );
  }

  // Regular card
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', relevanceColors.bg)}>
          <SourceIcon className={cn('w-4 h-4', relevanceColors.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-500">{insight.source}</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs text-slate-500">{insight.date}</span>
          </div>
          <h4 className="text-sm font-medium text-white">{insight.title}</h4>
        </div>
        <div className={cn(
          'px-2 py-0.5 rounded text-xs font-medium',
          relevanceColors.bg,
          relevanceColors.text
        )}>
          {insight.relevancePercent}%
        </div>
      </div>

      {/* Goal link */}
      {insight.linkedGoalTitle && (
        <p className="text-xs text-slate-500 mb-2">
          Связь с вашей Целью: <span className="text-sky-400">&quot;{insight.linkedGoalTitle}&quot;</span>
        </p>
      )}

      {/* Summary */}
      <p className="text-sm text-slate-400 mb-3">{insight.summary}</p>

      {/* Action */}
      <button className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors">
        <span>Открыть детали</span>
        <span>→</span>
      </button>
    </div>
  );
}
