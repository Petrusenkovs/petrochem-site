import { NextResponse } from 'next/server';
import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';

export async function GET(request: Request) {
  // Теперь конфликта имен не будет, так как мы не переопределяем глобальный URL ниже
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  console.log(`🔥 API Search. Тег: "${tag}"`);

  if (!tag || tag === 'null') return NextResponse.json({ data: [] });

  // ИСПРАВЛЕНИЕ: Переименовали URL -> DIRECTUS_URL
  const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://n8n6179.hostkey.in';
  const TOKEN = process.env.DIRECTUS_TOKEN;

  try {
    // Используем новое имя переменной
    const client = createDirectus(DIRECTUS_URL).with(rest());
    
    if (TOKEN) {
        client.with(staticToken(TOKEN));
    }

    const articles = await client.request(readItems('articles', {
      filter: {
        status: { _eq: 'published' },
        tags: { _icontains: tag }
      },
      fields: ['*', 'tags'], 
      limit: 10,
      sort: ['-date_created']
    }));

    // Маппинг для защиты от путаницы ID/UUID
    const sanitizedArticles = articles.map((item: any) => ({
        ...item,
        id: item.id || item.uuid || item.UUID, 
        slug: item.slug || item.id || item.uuid || item.UUID
    }));

    console.log(`✅ Найдено: ${sanitizedArticles.length}`);
    
    return NextResponse.json({ data: sanitizedArticles });

  } catch (error: any) {
    console.error('❌ Ошибка API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}