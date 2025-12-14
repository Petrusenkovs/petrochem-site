import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { getImageUrl } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

interface Article {
  title: string;
  image: string;
  content: string;
  date_created: string;
  author: string;
  category: string;
}

async function getPost(slug: string) {
  try {
    const result = await directus.request(
      readItems('articles', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' }
        },
        limit: 1,
      })
    );
    return result[0] as unknown as Article;
  } catch (error) {
    return null;
  }
}

// ⚠️ ИЗМЕНЕНИЕ: Тип params теперь Promise
export default async function SingleNewsPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // ⚠️ ИЗМЕНЕНИЕ: Сначала ждем разрешения промиса
  const { slug } = await params;
  
  // Теперь используем уже полученный slug
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-slate-900/95 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm relative z-10">
        
        <div className="p-6 border-b border-slate-800/50">
          <Link 
            href="/news" 
            className="inline-flex items-center text-slate-400 hover:text-sky-400 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к новостям
          </Link>
        </div>

        <div className="px-8 pt-8 pb-6">
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
             {post.category && (
               <span className="flex items-center text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
                 <Tag className="w-3 h-3 mr-1.5" />
                 {post.category}
               </span>
             )}
             <span className="flex items-center text-slate-400">
               <Calendar className="w-3 h-3 mr-1.5" />
               {new Date(post.date_created).toLocaleDateString('ru-RU')}
             </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {post.title}
          </h1>
        </div>

        {post.image && (
          <div className="w-full h-64 md:h-96 relative bg-slate-950">
            <img 
              src={getImageUrl(post.image, { width: 1200 }) || ''} 
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8 md:p-12">
          <div 
            className="prose prose-lg prose-invert max-w-none 
            prose-headings:text-white prose-p:text-slate-300 prose-a:text-sky-400 
            prose-strong:text-white prose-li:text-slate-300"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>

      </div>
    </main>
  );
}