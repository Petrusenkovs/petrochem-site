import { directus } from './directus';
import { readItems } from '@directus/sdk';

// 1. Обновляем интерфейсы
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

// Хелпер: Генерирует стабильный номер цвета (0-5) из строки
function getGroupColor(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 6); 
}

export async function fetchGraphData() {
  try {
    console.log("--> Запрос данных для графа (SDK)...");
    
    // 2. Запрашиваем данные из Directus
    const articles = await directus.request(readItems('articles', {
      fields: ['*', 'tags'], 
      limit: 300 // Лимит статей
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
      
      // Парсинг тегов (поддержка разных форматов Directus)
      if (article.tags) {
        if (Array.isArray(article.tags)) {
           // @ts-ignore
           tags = article.tags.map((t: any) => 
             typeof t === 'string' ? t : (t.tags_id?.name || t.name || t.tag || null)
           );
        } else if (typeof article.tags === 'string') {
           tags = article.tags.split(',').map((t: string) => t.trim());
        }
      } 
      
      // Очистка пустых значений
      tags = tags.filter(t => t && t.length > 0);

      // Если тегов нет, берем категорию
      if (tags.length === 0 && article.category) {
         tags = [article.category];
      }

      // 3. Считаем частоту тегов (вес узлов)
      tags.forEach(tag => {
        nodesMap.set(tag, (nodesMap.get(tag) || 0) + 1);
      });

      // 4. Считаем связи (вес линков)
      for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
          // Сортируем, чтобы связь A-B и B-A была одной и той же
          const linkId = [tags[i], tags[j]].sort().join('---');
          linksMap.set(linkId, (linksMap.get(linkId) || 0) + 1);
        }
      }
    });

    // 5. Формируем финальные массивы

    const nodes: GraphNode[] = Array.from(nodesMap.entries()).map(([id, count]) => ({
      id,
      // ГРУППА ТЕПЕРЬ ЗАВИСИТ ОТ ИМЕНИ (для разных цветов)
      group: getGroupColor(id), 
      // Логарифмический размер узла
      val: Math.log2(count + 1) * 3 
    }));

    const links: GraphLink[] = Array.from(linksMap.entries()).map(([linkId, weight]) => {
      const [source, target] = linkId.split('---');
      return { 
          source, 
          target, 
          value: weight // Толщина линии
      };
    });

    console.log(`--> Граф построен: ${nodes.length} узлов, ${links.length} связей`);
    return { nodes, links };

  } catch (error: any) {
    console.error("!!! ОШИБКА ПОСТРОЕНИЯ ГРАФА !!!");
    if (error?.errors) {
        console.error("Directus Error:", JSON.stringify(error.errors, null, 2));
    } else {
        console.error("Error details:", error);
    }
    return { nodes: [], links: [] };
  }
}