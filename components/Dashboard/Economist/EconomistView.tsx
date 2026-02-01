'use client';

import { motion } from 'framer-motion';
import PriceCard from './PriceCard';
import PriceChart from './PriceChart';
import EventTimeline from './EventTimeline';
import AISummary from './AISummary';
import { PriceData, TimelineEvent, AISummaryData } from '@/lib/dashboard/types';

interface EconomistViewProps {
  prices: PriceData[];
  events: TimelineEvent[];
  summary: AISummaryData;
}

export default function EconomistView({ prices, events, summary }: EconomistViewProps) {
  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Экономический Дашборд</h2>
          <p className="text-sm text-slate-500">Последнее обновление: {today}, 09:15</p>
        </div>
      </div>

      {/* Price cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices.map((price) => (
          <PriceCard key={price.id} price={price} />
        ))}
      </div>

      {/* Price chart */}
      <PriceChart prices={prices} />

      {/* Bottom row: Timeline + AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EventTimeline events={events} />
        <AISummary summary={summary} />
      </div>
    </motion.div>
  );
}
