import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardTitle, CardDescription, Badge } from '../ui';
import { localizedPath } from '@/lib/site';

export interface BlogProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  category_name?: string | null;
  published_at?: string | null;
}

export const BlogCard = ({ post, lang = 'vi' }: { post: BlogProps; lang?: string }) => {
  const hasImage = post.cover_image_url && post.cover_image_url !== '';
  const imageUrl = post.cover_image_url || '/images/placeholders/blog.jpg';

  return (
    <Card href={localizedPath(lang, `/blog/${post.slug}`)} hoverEffect>
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#AF8526] to-[#DDBB56] flex flex-col items-center justify-center p-4 text-center transition-transform duration-500 hover:scale-105">
            <span className="text-white font-medium text-xl shadow-sm">{post.category_name || 'Blog'}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="gold" className="shadow-sm">
            {post.category_name}
          </Badge>
        </div>
      </div>
      <CardContent>
        <CardTitle className="mb-2 line-clamp-2">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardContent>
    </Card>
  );
};
