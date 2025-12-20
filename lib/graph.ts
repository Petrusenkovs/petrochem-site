import { directus } from './directus';
import { readItems } from '@directus/sdk';

// 1. Обновляем интерфейсы, чтобы поддерживать веса (val, value)
export interface GraphNode {
  id: string;
  group: number;
  val: number; // Размер узла
}

export interface GraphLink {
  source: string;
  target: string;
  value: number; // Вес связи (толщина линии)
}

export async function fetchGraphData() {
  try {
    console.log("--> Запрос данных для графа (SDK)...");
    
    // 2. Используем проверенный метод загрузки (SDK)
    // Запрашиваем из коллекции 'articles', как в старом коде
    const articles = await directus.request(readItems('articles', {
      fields: ['*', 'tags'], 
      limit: 200 // Увеличил лимит, чтобы граф был интереснее
    }));

    console.log(`--> Загружено статей: ${articles.length}`);

    if (!articles || articles.length === 0) {
        return { nodes: [], links: [] };
    }

    const nodesMap = new Map<string, number>();
    const linksMap = new Map<string, number>();

    // @ts-ignore
    articles.forEach((article) => {
      let tags: string[] = [];
      
      // Логика из старого кода + небольшая защита от ошибок
      if (article.tags) {
        if (Array.isArray(article.tags)) {
           // Пытаемся достать имя тега из разных структур
           tags = article.tags.map((t: any) => 
             typeof t === 'string' ? t : (t.tags_id?.name || t.name || t.tag || null)
           );
        } else if (typeof article.tags === 'string') {
           tags = article.tags.split(',').map((t: string) => t.trim());
        }
      } 
      
      // Фильтруем null и пустые строки
      tags = tags.filter(t => t && t.length > 0);

      if (tags.length === 0 && article.category) {
         tags = [article.category];
      }

      // 3. Считаем частоту тегов (для размера шариков)
      tags.forEach(tag => {
        nodesMap.set(tag, (nodesMap.get(tag) || 0) + 1);
      });

      // 4. Считаем связи (для толщины линий)
      for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
          // Сортируем, чтобы связь A-B и B-A считалась одной и той же
          const linkId = [tags[i], tags[j]].sort().join('---');
          linksMap.set(linkId, (linksMap.get(linkId) || 0) + 1);
        }
      }
    });

    // 5. Формируем финальные массивы

    const nodes: GraphNode[] = Array.from(nodesMap.entries()).map(([id, count], index) => ({
      id,
      group: 1, // Можно вернуть index % 5 для разноцветности, но 1 - безопаснее для начала
      // Логарифмический размер: чтобы популярные темы не были огромными шарами
      val: Math.log2(count + 1) * 3 
    }));

    const links: GraphLink[] = Array.from(linksMap.entries()).map(([linkId, weight]) => {
      const [source, target] = linkId.split('---');
      return { 
          source, 
          target, 
          value: weight // <--- САМОЕ ВАЖНОЕ: Передаем вес на фронтенд!
      };
    });

    console.log(`--> Граф построен: ${nodes.length} узлов, ${links.length} связей`);
    return { nodes, links };

  } catch (error: any) {
    console.error("!!! ОШИБКА ПОСТРОЕНИЯ ГРАФА !!!");
    // Логируем ошибку, но возвращаем пустой граф, чтобы сайт не упал
    if (error?.errors) {
        console.error("Directus Error:", JSON.stringify(error.errors, null, 2));
    } else {
        console.error("Error details:", error);
    }
    return { nodes: [], links: [] };
  }
}