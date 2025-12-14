import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { NewsArticle } from '@/types/news';
import NewsFeed from '@/components/NewsFeed'; // Импортируем наш новый компонент

export const revalidate = 60; 

async function getNews() {
  try {
    // Добавляем 'tags' в запрос, чтобы поиск работал и по ним
    const result = await directus.request(
      readItems('articles', { 
        fields: ['*', 'tags'], // Важно: запрашиваем теги
        sort: ['-date_created'],
        filter: {
          status: { _eq: 'published' }
        }
      })
    );
    return result as unknown as NewsArticle[];
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    return [];
  }
}

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <main className="min-h-screen py-12 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Лента <span className="text-sky-400">Событий</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Мониторинг ключевых изменений в отрасли в реальном времени.
          </p>
        </div>

        {/* Всю логику отрисовки и фильтрации теперь делает этот компонент */}
        <NewsFeed articles={articles} />
        
      </div>
    </main>
  );
}