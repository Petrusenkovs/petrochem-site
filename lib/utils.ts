export function getImageUrl(
  imageId: string, 
  options: { width?: number; quality?: number; format?: string } = {}
) {
  if (!imageId) return null;
  
  // ⚠️ Убедитесь, что IP верный
  const baseUrl = 'https://n8n6179.hostkey.in'; 
  
  // ВОЗВРАЩАЕМ ЧИСТУЮ ССЫЛКУ БЕЗ ПАРАМЕТРОВ
  // Мы убрали ?width=... и &format=...
  return `${baseUrl}/assets/${imageId}`;
}