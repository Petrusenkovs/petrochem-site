import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { notFound } from 'next/navigation';
import ArticleViewer from './ArticleViewer'; // 👈 Импортируем наш новый компонент

// Типизация
interface Article {
  title: string;
  image: string;
  content: string;
  date_created: string;
  author: string;
  category: string;
}

// Получение поста с сервера Directus
async function getPost(slug: string) {
  try {
    const result = await directus.request(
      readItems('articles', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );
    return result[0] as unknown as Article;
  } catch (error) {
    return null;
  }
}

// Главная функция страницы
export default async function SingleNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Мы просто передаем данные в "Умный компонент просмотра"
  return <ArticleViewer post={post} />;
}