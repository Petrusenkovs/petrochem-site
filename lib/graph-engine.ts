// @/lib/graph-engine.ts

import { GraphNode, GraphLink } from './graph'; // Предполагаем, что типы там

// Интерфейс входящей статьи
interface Article {
  id: string;
  title: string;
  tags: string[]; // ['Пиролиз', 'Печь', 'Этилен']
}

export function buildGraphFromArticles(articles: Article[]) {
  const nodesMap = new Map<string, number>(); // Тег -> Кол-во упоминаний (размер узла)
  const linksMap = new Map<string, number>(); // "ТегA|ТегB" -> Вес связи

  // 1. Проходим по всем статьям
  articles.forEach(article => {
    // Убираем дубликаты тегов внутри одной статьи и сортируем
    const uniqueTags = Array.from(new Set(article.tags)).sort();

    // 2. Считаем узлы (просто частота встречаемости тега)
    uniqueTags.forEach(tag => {
      nodesMap.set(tag, (nodesMap.get(tag) || 0) + 1);
    });

    // 3. Строим связи (Каждый с каждым внутри статьи)
    // Если теги [A, B, C], создаем пары A-B, A-C, B-C
    for (let i = 0; i < uniqueTags.length; i++) {
      for (let j = i + 1; j < uniqueTags.length; j++) {
        const source = uniqueTags[i];
        const target = uniqueTags[j];
        
        // Создаем уникальный ключ связи "Source|Target"
        const linkKey = `${source}|${target}`;
        
        // Увеличиваем вес связи
        linksMap.set(linkKey, (linksMap.get(linkKey) || 0) + 1);
      }
    }
  });

  // 4. Формируем итоговые массивы для Графа
  const nodes: GraphNode[] = Array.from(nodesMap.entries()).map(([id, count]) => ({
    id,
    group: 1, // <--- Добавляем дефолтную группу, чтобы TS был спокоен и цвета работали
    // Нормализуем размер: чем чаще тег, тем он больше
    // Нормализуем размер: чем чаще тег, тем он больше (но не слишком огромный)
    val: Math.log2(count + 1) * 2 
  }));

  const links: GraphLink[] = Array.from(linksMap.entries()).map(([key, weight]) => {
    const [source, target] = key.split('|');
    return {
      source,
      target,
      value: weight // ВОТ ОН, ВЕС СВЯЗИ!
    };
  });

  return { nodes, links };
}