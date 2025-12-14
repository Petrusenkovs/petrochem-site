import { fetchGraphData } from '@/lib/graph';
import KnowledgeGraph from '@/components/background/KnowledgeGraph';

// Обновлять граф раз в час, чтобы не нагружать сервер
export const revalidate = 3600;

export default async function NetworkPage() {
  const data = await fetchGraphData();

  return (
    <main className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Глобальная Связность</h1>
            <p className="text-slate-400">Визуализация семантических связей между технологиями и событиями.</p>
        </div>

        {/* 3D Граф */}
        <KnowledgeGraph data={data} />

        {/* Статистика под графом */}
        <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-sky-400">{data.nodes.length}</div>
                <div className="text-sm text-slate-500">Активных Узлов</div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-emerald-400">{data.links.length}</div>
                <div className="text-sm text-slate-500">Нейронных Связей</div>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-bold text-purple-400">Live</div>
                <div className="text-sm text-slate-500">Статус Системы</div>
            </div>
        </div>

      </div>
    </main>
  );
}