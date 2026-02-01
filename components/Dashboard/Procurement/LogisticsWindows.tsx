'use client';

import { Truck, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogisticsWindow } from '@/lib/dashboard/types';
import { LOGISTICS_COLORS } from '@/lib/dashboard/constants';

interface LogisticsWindowsProps {
  windows: LogisticsWindow[];
}

const AVAILABILITY_LABELS = {
  open: 'ОТКРЫТО',
  limited: 'ОГРАНИЧЕНО',
  closed: 'ЗАКРЫТО',
};

const AVAILABILITY_ICONS = {
  open: CheckCircle2,
  limited: AlertCircle,
  closed: XCircle,
};

export default function LogisticsWindows({ windows }: LogisticsWindowsProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Truck className="w-5 h-5 text-orange-400" />
        <h3 className="text-lg font-bold text-white">Логистические Окна</h3>
      </div>

      {/* Windows list */}
      <div className="space-y-4">
        {windows.map((window) => {
          const colors = LOGISTICS_COLORS[window.availability];
          const StatusIcon = AVAILABILITY_ICONS[window.availability];

          return (
            <div
              key={window.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-3">
                <div className={cn('flex items-center gap-2 px-2 py-1 rounded', colors.bg)}>
                  <StatusIcon className={cn('w-4 h-4', colors.text)} />
                  <span className={cn('text-xs font-bold', colors.text)}>
                    {AVAILABILITY_LABELS[window.availability]}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{window.carrier}</span>
              </div>

              {/* Route info */}
              <h4 className="text-white font-medium mb-2">{window.route}</h4>

              {/* Details */}
              <div className="space-y-1.5">
                <p className="text-sm text-slate-400">{window.transitTime}</p>

                {window.reason && (
                  <p className="text-sm text-orange-400">
                    Причина: {window.reason}
                  </p>
                )}

                {window.alternatives && (
                  <p className="text-sm text-sky-400">
                    Альтернативы: {window.alternatives}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
