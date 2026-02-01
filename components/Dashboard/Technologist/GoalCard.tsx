'use client';

import { Settings, Bell, Clock, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TechGoal } from '@/lib/dashboard/types';
import { GOAL_STATUS_COLORS } from '@/lib/dashboard/constants';

interface GoalCardProps {
  goal: TechGoal;
  onOpen: (goal: TechGoal) => void;
  onToggleStatus: (id: string) => void;
}

export default function GoalCard({ goal, onOpen, onToggleStatus }: GoalCardProps) {
  const statusColors = GOAL_STATUS_COLORS[goal.status];

  return (
    <div
      className={cn(
        'bg-slate-900/40 border rounded-xl p-4 transition-all',
        goal.status === 'active' ? 'border-slate-700 hover:border-sky-500/50' : 'border-slate-800 opacity-70'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', statusColors.bg)}>
          <Settings className={cn('w-4 h-4', statusColors.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{goal.title}</h4>
          <p className="text-xs text-slate-500 truncate">{goal.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus(goal.id);
          }}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          {goal.status === 'paused' ? (
            <Play className="w-4 h-4 text-slate-500" />
          ) : (
            <Pause className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      {/* Status info */}
      <div className="bg-slate-950/50 rounded-lg p-3 space-y-2">
        {goal.newMaterials > 0 ? (
          <div className="flex items-center gap-2 text-xs">
            <Bell className="w-3 h-3 text-sky-400" />
            <span className="text-sky-400">{goal.newMaterials} новых материала</span>
          </div>
        ) : goal.relevance ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">✓</span>
            <span className="text-slate-400">Релевантность {goal.relevance}%</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">💤</span>
            <span className="text-slate-500">Нет обновлений</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          <span>{goal.lastUpdate}</span>
        </div>

        {goal.status === 'active' && (
          <button
            onClick={() => onOpen(goal)}
            className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors mt-1"
          >
            <span>Открыть</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
