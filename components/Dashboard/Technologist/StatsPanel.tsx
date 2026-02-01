'use client';

import { BarChart3, FileText, Bookmark, Search, Target, TrendingUp, Users, Link2, Activity, Share2, BookOpen, MessageSquare } from 'lucide-react';
import { UserStats, HotTopic, Expert } from '@/lib/dashboard/types';

interface StatsPanelProps {
  stats: UserStats;
  hotTopics: HotTopic[];
  experts: Expert[];
}

export default function StatsPanel({ stats, hotTopics, experts }: StatsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Ваша активность */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ваша активность</h3>
        </div>

        <p className="text-xs text-slate-500 mb-3">За последние 7 дней:</p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Прочитано материалов:</span>
            </div>
            <span className="text-sm font-bold text-white">{stats.materialsRead}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Bookmark className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Сохранено в базу:</span>
            </div>
            <span className="text-sm font-bold text-white">{stats.savedToBase}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Search className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Поисковых запросов:</span>
            </div>
            <span className="text-sm font-bold text-white">{stats.searchQueries}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1">
              <span className="text-sm text-slate-300">Активных целей:</span>
            </div>
            <span className="text-sm font-bold text-white">{stats.activeGoals}</span>
          </div>
        </div>
      </div>

      {/* Горячие темы */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Горячие темы <span className="text-slate-500 font-normal">(эта неделя)</span>
          </h3>
        </div>

        <div className="space-y-3">
          {hotTopics.map((topic, index) => (
            <div key={topic.id} className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-500 w-4">{index + 1}.</span>
              <div className="flex-1">
                <span className="text-sm text-slate-300">{topic.name}</span>
              </div>
              <span className="text-xs text-emerald-400">↑ {topic.publications} публикаций</span>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 text-center text-xs text-sky-400 hover:text-sky-300 transition-colors">
          Смотреть все тренды →
        </button>
      </div>

      {/* Эксперты */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Эксперты в вашей области</h3>
        </div>

        <div className="space-y-4">
          {experts.map((expert) => (
            <div key={expert.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {expert.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{expert.name}</p>
                <p className="text-xs text-slate-500">{expert.company}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Последняя активность: <span className="text-sky-400">{expert.lastActivity}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 text-center text-xs text-sky-400 hover:text-sky-300 transition-colors">
          Все эксперты →
        </button>
      </div>

      {/* Быстрые ссылки */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Быстрые ссылки</h3>
        </div>

        <div className="space-y-2">
          <a href="/network" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Share2 className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-slate-300">Граф Знаний (Некусус)</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">База Знаний</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-300">AI Чат-Помощник</span>
          </a>
          <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-slate-300">Аналитические Отчёты</span>
          </a>
        </div>
      </div>
    </div>
  );
}
