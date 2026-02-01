'use client';

import { Bot, Filter } from 'lucide-react';
import { AIInsight, TechGoal } from '@/lib/dashboard/types';
import InsightCard from './InsightCard';

interface InsightsPanelProps {
  insights: AIInsight[];
  goals: TechGoal[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  // Сортируем инсайты по релевантности
  const sortedInsights = [...insights].sort((a, b) => b.relevancePercent - a.relevancePercent);
  const featuredInsight = sortedInsights[0];
  const otherInsights = sortedInsights.slice(1);

  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-bold text-white">AI Инсайты для вас</h2>
          </div>
          <p className="text-sm text-slate-500">Сегодня, {today}</p>
        </div>

        <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-slate-400 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Фильтры</span>
        </button>
      </div>

      {/* Featured insight */}
      {featuredInsight && (
        <InsightCard insight={featuredInsight} featured />
      )}

      {/* Divider */}
      <div className="border-t border-slate-800 my-6" />

      {/* Other insights */}
      <div className="space-y-4">
        {otherInsights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* News link */}
      <div className="mt-6 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>📰</span>
            <span>ЛЕНТА НОВОСТЕЙ (фильтр: Technology + Modeling)</span>
          </div>
          <a
            href="/news"
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            См. раздел &quot;Новости&quot; для полной ленты →
          </a>
        </div>
      </div>
    </div>
  );
}
