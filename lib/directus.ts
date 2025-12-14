import { createDirectus, rest } from '@directus/sdk';

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export const directus = createDirectus(directusUrl).with(rest());

export function getImageUrl(imageId: string) {
  if (!imageId) return null;
  return `${directusUrl}/assets/${imageId}`;
}