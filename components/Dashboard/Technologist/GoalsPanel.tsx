'use client';

import { Plus, Target, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechGoal, TrackedTechnology } from '@/lib/dashboard/types';
import { TREND_COLORS } from '@/lib/dashboard/constants';
import GoalCard from './GoalCard';

interface GoalsPanelProps {
  goals: TechGoal[];
  technologies: TrackedTechnology[];
  onAddGoal: () => void;
  onOpenGoal: (goal: TechGoal) => void;
  onToggleGoalStatus: (id: string) => void;
}

export default function GoalsPanel({
  goals,
  technologies,
  onAddGoal,
  onOpenGoal,
  onToggleGoalStatus,
}: GoalsPanelProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 h-full">
      {/* Header - Мои цели */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Мои Цели</h3>
        </div>
        <button
          onClick={onAddGoal}
          className="flex items-center gap-1 px-2 py-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg text-sky-400 text-xs font-medium transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Новая</span>
        </button>
      </div>

      {/* Goals list */}
      <div className="space-y-3 mb-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onOpen={onOpenGoal}
            onToggleStatus={onToggleGoalStatus}
          />
        ))}
      </div>

      {/* Отслеживаемые технологии */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Отслеживаемые технологии
          </h3>
        </div>

        <div className="space-y-3">
          {technologies.map((tech) => {
            const trendColors = TREND_COLORS[tech.trend];
            return (
              <div key={tech.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{tech.name}</span>
                  <span className={cn('flex items-center gap-1', trendColors.text)}>
                    {tech.publicationsPerMonth} пуб./мес
                    {tech.trend !== 'stable' && (
                      <span>
                        {tech.trend === 'up' ? '↑' : '↓'} {tech.changePercent > 0 ? '+' : ''}
                        {tech.changePercent}%
                      </span>
                    )}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      tech.trend === 'up' ? 'bg-green-500' : tech.trend === 'down' ? 'bg-red-500' : 'bg-slate-600'
                    )}
                    style={{ width: `${Math.min(tech.publicationsPerMonth * 4, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
