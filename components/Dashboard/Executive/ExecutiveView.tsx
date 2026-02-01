'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Target, AlertTriangle,
  FileText, Bot, ShieldAlert, DollarSign,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechGoal, PriceData, SanctionAlert, AIInsight } from '@/lib/dashboard/types';

interface ExecutiveViewProps {
  goals: TechGoal[];
  prices: PriceData[];
  sanctions: SanctionAlert[];
  insights: AIInsight[];
}

export default function ExecutiveView({ goals, prices, sanctions, insights }: ExecutiveViewProps) {
  // Calculate KPIs
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const highRelevanceInsights = insights.filter(i => i.relevance === 'high').length;
  const criticalSanctions = sanctions.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;

  // Price summary
  const avgPriceChange = prices.reduce((acc, p) => acc + p.change, 0) / prices.length;
  const isPriceUp = avgPriceChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Обзор Руководителя</h2>
        <p className="text-sm text-slate-500">Ключевые показатели и риски</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Goals */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-sky-500/20 rounded-lg">
              <Target className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-xs text-slate-500">R&D</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{activeGoals}</p>
          <p className="text-sm text-slate-400">Активных целей</p>
        </div>

        {/* High Relevance Insights */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs text-slate-500">AI</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{highRelevanceInsights}</p>
          <p className="text-sm text-slate-400">Важных инсайтов</p>
        </div>

        {/* Price Trend */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={cn('p-2 rounded-lg', isPriceUp ? 'bg-green-500/20' : 'bg-red-500/20')}>
              {isPriceUp ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <span className="text-xs text-slate-500">Рынок</span>
          </div>
          <p className={cn('text-3xl font-bold mb-1', isPriceUp ? 'text-green-400' : 'text-red-400')}>
            {isPriceUp ? '+' : ''}{avgPriceChange.toFixed(1)}%
          </p>
          <p className="text-sm text-slate-400">Средний рост цен</p>
        </div>

        {/* Risk Alerts */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className={cn('p-2 rounded-lg', criticalSanctions > 0 ? 'bg-red-500/20' : 'bg-green-500/20')}>
              <ShieldAlert className={cn('w-5 h-5', criticalSanctions > 0 ? 'text-red-400' : 'text-green-400')} />
            </div>
            <span className="text-xs text-slate-500">Риски</span>
          </div>
          <p className={cn('text-3xl font-bold mb-1', criticalSanctions > 0 ? 'text-red-400' : 'text-green-400')}>
            {criticalSanctions}
          </p>
          <p className="text-sm text-slate-400">Критических алертов</p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Overview */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Ключевые Цены</h3>
            </div>
            <a href="#" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Подробнее <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-3">
            {prices.map((price) => (
              <div key={price.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{price.name}</p>
                  <p className="text-xs text-slate-500">{price.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {price.code === 'BRENT'
                      ? `$${price.currentPrice.toFixed(2)}`
                      : price.code === 'LOGISTICS'
                      ? `${price.currentPrice} дней`
                      : new Intl.NumberFormat('ru-RU').format(price.currentPrice) + ' ₽'}
                  </p>
                  <p className={cn(
                    'text-xs font-medium',
                    price.trend === 'up' ? 'text-green-400' : price.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                  )}>
                    {price.trend === 'up' ? '↑' : price.trend === 'down' ? '↓' : '→'} {price.change > 0 ? '+' : ''}{price.change.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Summary */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">Сводка Рисков</h3>
            </div>
            <a href="#" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
              Все риски <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-3">
            {sanctions.slice(0, 3).map((sanction) => {
              const riskColors = {
                critical: { bg: 'bg-red-500/20', text: 'text-red-400' },
                high: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
                medium: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
                low: { bg: 'bg-green-500/20', text: 'text-green-400' },
              };
              const colors = riskColors[sanction.riskLevel];

              return (
                <div key={sanction.id} className="p-3 bg-slate-950/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{sanction.supplier}</p>
                    <span className={cn('px-2 py-0.5 rounded text-xs font-medium', colors.bg, colors.text)}>
                      {sanction.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{sanction.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Insights */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Топ AI Инсайты</h3>
          </div>
          <a href="#" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1">
            Все инсайты <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.filter(i => i.relevance === 'high').slice(0, 3).map((insight) => (
            <div key={insight.id} className="p-4 bg-slate-950/50 rounded-xl border border-sky-500/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded text-xs font-medium">
                  {insight.relevancePercent}%
                </span>
                <span className="text-xs text-slate-500">{insight.sourceType}</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">{insight.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{insight.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
