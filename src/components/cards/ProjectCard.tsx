import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import type { Project } from '@/lib/content/types';

export interface ProjectCardProps {
  project: Project;
  /** Index shown as a running number; pass the position in the list. */
  index?: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden bg-[#E6DCCC]" style={{ aspectRatio: '4 / 5' }}>
        {project.coverUrl && (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        )}
        {typeof index === 'number' && (
          <span className="absolute left-3 top-3 font-syne text-[10px] font-bold tracking-[0.22em] text-[#F5EFE6] mix-blend-difference">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-3 font-syne text-[9px] font-bold uppercase tracking-[0.26em] text-[#161413]/40">
          {project.category && <span>{project.category}</span>}
          {project.category && project.year && <span className="h-px w-4 bg-[#161413]/20" />}
          {project.year && <span>{project.year}</span>}
        </div>

        <h3 className="mt-3 font-syne text-[clamp(1.0625rem,1.6vw,1.375rem)] font-bold leading-tight tracking-[-0.01em] text-[#161413] transition-colors group-hover:text-[#8B1117]">
          {project.title}
        </h3>

        {project.location && (
          <p className="mt-2 text-[13px] leading-[1.7] text-[#584E44]">{project.location}</p>
        )}
      </div>
    </Link>
  );
}
