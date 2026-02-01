'use client';

import { motion } from 'framer-motion';
import SanctionRadar from './SanctionRadar';
import AlternativeSuppliers from './AlternativeSuppliers';
import LogisticsWindows from './LogisticsWindows';
import { SanctionAlert, Supplier, LogisticsWindow } from '@/lib/dashboard/types';

interface ProcurementViewProps {
  sanctions: SanctionAlert[];
  suppliers: Supplier[];
  logistics: LogisticsWindow[];
}

export default function ProcurementView({ sanctions, suppliers, logistics }: ProcurementViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 lg:p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Мониторинг Закупок и Санкций</h2>
        <p className="text-sm text-slate-500">Актуальный статус поставщиков и логистики</p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sanction Radar - takes 2 columns */}
        <div className="lg:col-span-2">
          <SanctionRadar sanctions={sanctions} />
        </div>

        {/* Logistics Windows */}
        <div>
          <LogisticsWindows windows={logistics} />
        </div>
      </div>

      {/* Alternative Suppliers */}
      <AlternativeSuppliers suppliers={suppliers} />
    </motion.div>
  );
}
