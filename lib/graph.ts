import { directus } from './directus';
import { readItems } from '@directus/sdk';

// Интерфейсы
export interface GraphNode {
  id: string;
  group: number; // Номер группы для цвета (0-5)
  val: number;   // Размер узла
}

export interface GraphLink {
  source: string;
  target: string;
  value: number; // Вес связи (толщина линии)
}

// Статья с категорией и тегами (для фильтрации на клиенте)
export interface ArticleForGraph {
  id: string;
  category: string;
  tags: string[];
}

// Расширенный результат для поддержки фильтрации по категориям
export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  articles: ArticleForGraph[]; // Для фильтрации на клиенте
}

// Хелпер: Генерирует стабильный номер цвета (0-5) из строки
function getGroupColor(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 6);
}

// Хелпер: Парсит теги из строки (через запятую) или массива
function parseTags(tags: any): string[] {
  if (!tags) return [];

  if (typeof tags === 'string') {
    // Теги записаны через запятую
    return tags.split(',').map((t: string) => t.trim()).filter(t => t.length > 0);
  }

  if (Array.isArray(tags)) {
    return tags
      .map((t: any) => typeof t === 'string' ? t.trim() : (t?.name || ''))
      .filter(t => t.length > 0);
  }

  return [];
}

// Функция построения графа из списка статей
export function buildGraphFromArticles(articles: ArticleForGraph[]): { nodes: GraphNode[]; links: GraphLink[] } {
  const nodesMap = new Map<string, number>();
  const linksMap = new Map<string, number>();

  articles.forEach((article) => {
    const tags = article.tags;

    // Считаем частоту тегов (вес узлов)
    tags.forEach(tag => {
      nodesMap.set(tag, (nodesMap.get(tag) || 0) + 1);
    });

    // Считаем связи (вес линков)
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        // Сортируем, чтобы связь A-B и B-A была одной и той же
        const linkId = [tags[i], tags[j]].sort().join('---');
        linksMap.set(linkId, (linksMap.get(linkId) || 0) + 1);
      }
    }
  });

  const nodes: GraphNode[] = Array.from(nodesMap.entries()).map(([id, count]) => ({
    id,
    group: getGroupColor(id),
    val: Math.log2(count + 1) * 3
  }));

  const links: GraphLink[] = Array.from(linksMap.entries()).map(([linkId, weight]) => {
    const [source, target] = linkId.split('---');
    return { source, target, value: weight };
  });

  return { nodes, links };
}

export async function fetchGraphData(): Promise<GraphData> {
  try {
    console.log("--> Запрос данных для графа (SDK)...");

    // Запрашиваем ТОЛЬКО опубликованные статьи из Directus
    const rawArticles = await directus.request(readItems('articles', {
      filter: {
        status: { _eq: 'published' }
      },
      fields: ['*', 'tags'],  // Все поля, т.к. 'id' может быть недоступен напрямую
      limit: 300
    }));

    console.log(`--> Загружено опубликованных статей: ${rawArticles.length}`);

    if (!rawArticles || rawArticles.length === 0) {
      return { nodes: [], links: [], articles: [] };
    }

    // Преобразуем в нужный формат с парсингом тегов
    const articles: ArticleForGraph[] = rawArticles.map((article: any) => {
      let tags = parseTags(article.tags);

      // Если тегов нет, используем категорию как тег
      if (tags.length === 0 && article.category) {
        tags = [article.category];
      }

      return {
        id: article.id || article.uuid || article.UUID,  // Fallback для разных схем Directus
        category: article.category || '',
        tags
      };
    });

    // Строим граф из всех статей
    const { nodes, links } = buildGraphFromArticles(articles);

    console.log(`--> Граф построен: ${nodes.length} узлов, ${links.length} связей`);

    return { nodes, links, articles };

  } catch (error: any) {
    console.error("!!! ОШИБКА ПОСТРОЕНИЯ ГРАФА !!!");
    if (error?.errors) {
      console.error("Directus Error:", JSON.stringify(error.errors, null, 2));
    } else {
      console.error("Error details:", error);
    }
    return { nodes: [], links: [], articles: [] };
  }
}