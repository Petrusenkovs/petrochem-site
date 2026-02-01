import { fetchGraphData, GraphData } from '@/lib/graph';
import NetworkLayout from '@/components/Network/NetworkLayout';

// Обновление каждые 10 минут (вместо 1 часа)
export const revalidate = 600;

export default async function NetworkPage() {
  let data: GraphData = { nodes: [], links: [], articles: [] };

  try {
    const fetchedData = await fetchGraphData();
    if (fetchedData) {
      data = fetchedData;
    }
  } catch (error) {
    console.error("Ошибка загрузки графа:", error);
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <NetworkLayout data={data} />
    </main>
  );
}