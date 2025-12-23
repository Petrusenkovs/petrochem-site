// lib/utils.ts

// Убираем зависимость от clsx и tailwind-merge, чтобы не было ошибок установки
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// --- УТИЛИТА ДЛЯ КАРТИНОК ---
export function getImageUrl(
  imageId?: string | null,
  options: { width?: number; quality?: number; fit?: string } = {}
) {
  // 1. Проверки на пустоту
  if (!imageId) return null;
  if (imageId.startsWith('http')) return imageId;

  // 2. Базовый URL
  const baseUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://n8n6179.hostkey.in';
  
  // 3. Собираем параметры
  const params = new URLSearchParams();
  
  if (options.width) params.append('width', options.width.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.fit) params.append('fit', options.fit);

  const queryString = params.toString();

  // 4. Итоговая ссылка
  return `${baseUrl}/assets/${imageId}${queryString ? `?${queryString}` : ''}`;
}