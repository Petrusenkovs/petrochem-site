import { directus } from './directus';
import { readItems } from '@directus/sdk';

export interface GraphNode {
  id: string;
  group: number;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export async function fetchGraphData() {
  try {
    console.log("--> Запрос данных для графа...");
    
    // 1. Загружаем статьи
    // ИЗМЕНЕНИЕ: Запрашиваем '*' (все поля), чтобы точно получить и UUID, и tags
    const articles = await directus.request(readItems('articles', {
      fields: ['*', 'tags'], 
      limit: 100
    }));

    console.log(`--> Загружено статей: ${articles.length}`);

    const nodesMap = new Map<string, number>();
    const linksMap = new Map<string, number>();

    // @ts-ignore
    articles.forEach((article) => {
      // ИЗМЕНЕНИЕ: Используем UUID как ID, если обычного id нет
      const articleId = article.UUID || article.id; 

      let tags: string[] = [];
      
      // Логика обработки тегов (как раньше)
      if (article.tags) {
        if (Array.isArray(article.tags)) {
           tags = article.tags.map((t: any) => typeof t === 'string' ? t : (t.tags_id?.name || t.name || 'Tag'));
        } else if (typeof article.tags === 'string') {
           tags = article.tags.split(',').map((t: string) => t.trim());
        }
      } 
      
      if (tags.length === 0 && article.category) {
         tags = [article.category];
      }

      // Строим узлы
      tags.forEach(tag => {
        if (!tag) return;
        nodesMap.set(tag, (nodesMap.get(tag) || 0) + 1);
      });

      // Строим связи
      for (let i = 0; i < tags.length; i++) {
        for (let j = i + 1; j < tags.length; j++) {
          const linkId = [tags[i], tags[j]].sort().join('---');
          linksMap.set(linkId, (linksMap.get(linkId) || 0) + 1);
        }
      }
    });

    const nodes: GraphNode[] = Array.from(nodesMap.entries()).map(([id, count], index) => ({
      id,
      group: index % 5,
      val: count
    }));

    const links: GraphLink[] = Array.from(linksMap.keys()).map(linkId => {
      const [source, target] = linkId.split('---');
      return { source, target };
    });

    console.log(`--> Граф построен: ${nodes.length} узлов, ${links.length} связей`);
    return { nodes, links };

  } catch (error: any) {
    console.error("!!! ОШИБКА ПОСТРОЕНИЯ ГРАФА !!!");
    if (error?.errors) {
        console.error("Directus Error:", JSON.stringify(error.errors, null, 2));
    } else {
        console.error("Unknown Error:", error);
    }
    return { nodes: [], links: [] };
  }
}