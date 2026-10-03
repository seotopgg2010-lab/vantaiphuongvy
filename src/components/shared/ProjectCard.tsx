import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardTitle, Badge } from '../ui';
import { MapPin, Building2 } from 'lucide-react';
import { localizedPath } from '@/lib/site';

export interface ProjectProps {
  slug: string;
  name: string;
  location?: string | null;
  business_type?: string | null;
  images?: string[] | null;
}

export const ProjectCard = ({ project, lang = 'vi' }: { project: ProjectProps; lang?: string }) => {
  const hasImage = project.images?.[0] && project.images[0] !== '';
  const imageUrl = project.images?.[0];

  return (
    <Card href={localizedPath(lang, `/du-an/${project.slug}`)} hoverEffect>
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        {hasImage ? (
          <Image
            src={imageUrl || '/images/placeholders/project.jpg'}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2B2B] to-[#202020] flex flex-col items-center justify-center p-4 text-center transition-transform duration-500 hover:scale-105">
            <Building2 className="w-10 h-10 text-white/50 mb-2" />
            <span className="text-white font-medium text-lg">{project.business_type || (lang === 'en' ? 'Project' : 'D\u1ef1 \u00e1n')}</span>
          </div>
        )}
      </div>
      <CardContent>
        <CardTitle className="mb-3 line-clamp-2">{project.name}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <MapPin size={12} />
            {project.location}
          </Badge>
          <Badge variant="gold" className="flex items-center gap-1">
            <Building2 size={12} />
            {project.business_type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
