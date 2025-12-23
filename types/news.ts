export interface NewsArticle {
  UUID?: string;       // Учитываем ваш UUID
  id?: number | string;
  title: string;
  slug: string;
  excerpt: string;     
  content?: string;    
  image: string;       
  date_created: string;
  category: string;
  tags?: string[] | string; // Теги могут прийти массивом или строкой
  author?: string;
  published_date?: string
}