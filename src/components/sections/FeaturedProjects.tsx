import Link from 'next/link';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { Project } from '@/types/database';
import type { Dictionary } from '@/app/[lang]/dictionaries';
import { localizedPath } from '@/lib/site';

const fallbackProjects = [] as Project[];

interface FeaturedProjectsProps {
  dict: Dictionary;
  projects?: Project[];
  lang: string;
}

export function FeaturedProjects({ dict, projects, lang }: FeaturedProjectsProps) {
  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <SectionHeading 
            title={dict.featuredProjects.sectionTitle}
            subtitle={dict.featuredProjects.sectionLabel}
          />
          <Link href={localizedPath(lang, '/du-an')} className="hidden md:block">
            <Button variant="secondary" className="border-brief-red text-brief-red hover:bg-brief-red hover:text-white font-semibold">
              {dict.featuredProjects.viewAllProjects} →
            </Button>
          </Link>
        </div>
        
      {displayProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <div key={project.id || project.slug} className="h-full">
              <ProjectCard project={project} lang={lang} />
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-brief-neutral bg-white p-8 text-center text-brief-soft-ink">
          {lang.toLowerCase().startsWith('en') ? 'Verified projects will be added after approval.' : 'Dự án đã xác nhận sẽ được cập nhật sau khi duyệt nội dung.'}
        </p>
      )}
        
        <div className="mt-8 text-center md:hidden">
          <Link href={localizedPath(lang, '/du-an')}>
            <Button variant="secondary" className="border-brief-red text-brief-red hover:bg-brief-red hover:text-white w-full">
              {dict.featuredProjects.viewAllProjects} →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
