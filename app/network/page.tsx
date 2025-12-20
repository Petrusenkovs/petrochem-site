import { fetchGraphData } from '@/lib/graph';
// Мы заменяем прямой импорт KnowledgeGraph на наш новый Клиентский Контроллер
import NetworkClient from './NetworkClient'; 

// -----------------------------------------------------------------------------
// КОНФИГУРАЦИЯ СТРАНИЦЫ
// -----------------------------------------------------------------------------

// Обновлять граф раз в час (ISR - Incremental Static Regeneration)
export const revalidate = 3600;

export default async function NetworkPage() {
  // ---------------------------------------------------------------------------
  // ПОЛУЧЕНИЕ ДАННЫХ (Server Side)
  // ---------------------------------------------------------------------------
  
  // Инициализируем пустую структуру
  let data = { nodes: [] as any[], links: [] as any[] };

  try {
    const fetchedData = await fetchGraphData();
    if (fetchedData) {
      data = fetchedData;
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных графа:", error);
  }

  // Статистика для карточек
  const activeNodesCount = data?.nodes?.length || 0;
  const activeLinksCount = data?.links?.length || 0;

  // ---------------------------------------------------------------------------
  // РЕНДЕРИНГ (UI)
  // ---------------------------------------------------------------------------
  return (
    <main className="min-h-screen pt-24 px-4 pb-12 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-grow flex flex-col">
        
        {/* Заголовок секции */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
                Карта связей
            </h1>
            <p className="text-slate-400">
                Визуализация семантических связей между технологиями и событиями.
            </p>
        </div>

        {/* Основной контейнер.
            Здесь мы вызываем NetworkClient вместо KnowledgeGraph.
            NetworkClient сам внутри себя отрисует Граф и Сайдбар.
        */}
        <div className="relative w-full h-[700px] bg-slate-900/20 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
            <NetworkClient data={data} />
        </div>

        {/* Секция статистики (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            
            {/* Карточка: Активные Узлы */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center hover:border-sky-500/30 transition-colors">
                <div className="text-3xl font-bold text-sky-400">
                    {activeNodesCount}
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                    Активных Тем
                </div>
            </div>
            
            {/* Карточка: Нейронные Связи */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center hover:border-emerald-500/30 transition-colors">
                <div className="text-3xl font-bold text-emerald-400">
                    {activeLinksCount}
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                    Смысловых Связей
                </div>
            </div>
            
            {/* Карточка: Статус */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center hover:border-purple-500/30 transition-colors">
                <div className="text-3xl font-bold text-purple-400 flex items-center justify-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                    Live
                </div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                    Статус Системы
                </div>
            </div>

        </div>

      </div>
    </main>
  );
}