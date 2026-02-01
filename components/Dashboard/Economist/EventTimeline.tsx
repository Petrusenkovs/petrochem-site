'use client';

import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimelineEvent } from '@/lib/dashboard/types';
import { EVENT_TYPE_COLORS, IMPACT_COLORS } from '@/lib/dashboard/constants';

interface EventTimelineProps {
  events: TimelineEvent[];
}

const EVENT_TYPE_LABELS = {
  market: 'Рынок',
  regulation: 'Регулирование',
  technology: 'Технология',
  logistics: 'Логистика',
  sanction: 'Санкции',
};

export default function EventTimeline({ events }: EventTimelineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-bold text-white">Хронология событий</h3>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-800" />

        <div className="space-y-4">
          {events.map((event, index) => {
            const typeColors = EVENT_TYPE_COLORS[event.type];
            const impactColor = IMPACT_COLORS[event.impact];

            return (
              <div key={event.id} className="relative pl-10">
                {/* Dot */}
                <div
                  className={cn(
                    'absolute left-3 top-1.5 w-3 h-3 rounded-full ring-4 ring-slate-900',
                    typeColors.bg.replace('/20', '')
                  )}
                />

                {/* Date */}
                <div className="text-xs text-slate-500 mb-1">{formatDate(event.date)}</div>

                {/* Content */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white">{event.title}</h4>
                    <span
                      className={cn('px-2 py-0.5 rounded text-[10px] font-medium', typeColors.bg, typeColors.text)}
                    >
                      {EVENT_TYPE_LABELS[event.type]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{event.description}</p>
                  {event.priceEffect && (
                    <p className={cn('text-xs font-medium', impactColor)}>
                      → Влияние: {event.priceEffect}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
