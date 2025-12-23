import { fetchGraphData, GraphNode, GraphLink } from '@/lib/graph';
import NetworkLayout from '@/components/Network/NetworkLayout';

export const revalidate = 3600;

export default async function NetworkPage() {
  // ИСПРАВЛЕНИЕ: Явно указываем типы, чтобы TS не думал, что массивы вечно пустые
  let data: { nodes: GraphNode[]; links: GraphLink[] } = { nodes: [], links: [] };

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