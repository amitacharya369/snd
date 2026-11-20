import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '../types';
import { ArrowRight, MapPin, Calendar, Building2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col bg-white border-2 border-slate-200 rounded-sm overflow-hidden hover:border-amber-500 hover:shadow-xl transition-all duration-300">
      {/* Thumbnail Aspect Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-200">
        <Image
          src={project.featuredImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Location & Year Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#0f2b48]/90 backdrop-blur-md border border-slate-600 text-xs font-bold text-white shadow">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {project.location}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#0f2b48]/90 backdrop-blur-md border border-slate-600 text-xs font-bold text-white shadow">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            {project.completionYear}
          </span>
        </div>

        {/* Highlight Stat Badge */}
        {project.highlightStat && (
          <div className="absolute bottom-3 right-3 text-right">
            <div className="px-3 py-1 rounded-sm bg-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-md border border-amber-600 font-condensed">
              {project.highlightStat.value} {project.highlightStat.label}
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="text-xs sm:text-sm text-amber-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{project.client}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#0f2b48] group-hover:text-amber-700 transition-colors leading-tight font-heading uppercase">
            <Link href={`/projects/${project.slug}`} className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              {project.title}
            </Link>
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {project.summary}
          </p>
        </div>

        {/* Tags and Action Link */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex flex-wrap gap-1.5">
            {project.specifications.materials.slice(0, 2).map((mat) => (
              <span
                key={mat}
                className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 uppercase"
              >
                {mat}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-700 group-hover:text-amber-800 uppercase tracking-wider transition-colors font-condensed">
            Scope &amp; Specs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}
