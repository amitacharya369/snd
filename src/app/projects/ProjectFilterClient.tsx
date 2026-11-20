'use client';

import React, { useState, useMemo } from 'react';
import { Project, IndustryId, CapabilityId } from '../../types';
import { ProjectCard } from '../../components/ProjectCard';
import { Search, Filter, X } from 'lucide-react';

interface Props {
  initialProjects: Project[];
}

export function ProjectFilterClient({ initialProjects }: Props) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCapability, setSelectedCapability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      if (selectedIndustry !== 'all' && !project.industries.includes(selectedIndustry as IndustryId)) {
        return false;
      }
      if (selectedCapability !== 'all' && !project.capabilities.includes(selectedCapability as CapabilityId)) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(query);
        const matchClient = project.client.toLowerCase().includes(query);
        const matchLocation = project.location.toLowerCase().includes(query);
        const matchSummary = project.summary.toLowerCase().includes(query);
        const matchMaterials = project.specifications.materials.some((m) => m.toLowerCase().includes(query));
        if (!matchTitle && !matchClient && !matchLocation && !matchSummary && !matchMaterials) {
          return false;
        }
      }
      return true;
    });
  }, [initialProjects, selectedIndustry, selectedCapability, searchQuery]);

  const hasActiveFilters = selectedIndustry !== 'all' || selectedCapability !== 'all' || searchQuery.trim() !== '';

  const clearFilters = () => {
    setSelectedIndustry('all');
    setSelectedCapability('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Bar (Bright Construction Look) */}
      <div className="p-6 bg-white border-2 border-slate-300 rounded-sm shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Keyword Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project name, client, materials..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Industry Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded text-sm text-[#0f2b48] font-bold focus:outline-none focus:border-amber-500 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Industries &amp; Environments</option>
              <option value="transportation">Transit &amp; Rail Authorities</option>
              <option value="airports">Airports &amp; Aviation Terminals</option>
              <option value="commercial">Commercial High-Rise &amp; Mixed-Use</option>
              <option value="institutional">Education &amp; Institutions</option>
              <option value="infrastructure">Public Sector &amp; Civil Infrastructure</option>
              <option value="civic">Stadiums &amp; Civic Venues</option>
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Capability Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded text-sm text-[#0f2b48] font-bold focus:outline-none focus:border-amber-500 focus:bg-white appearance-none cursor-pointer"
            >
              <option value="all">All Trade Capabilities</option>
              <option value="architectural-signage">Architectural Signage &amp; Wayfinding</option>
              <option value="interior-signage">Interior Signage &amp; ADA</option>
              <option value="exterior-signage">Exterior Monument Signage</option>
              <option value="illuminated-signage">Illuminated &amp; LED Systems</option>
              <option value="vinyl-graphics">Vinyl &amp; Environmental Graphics</option>
              <option value="architectural-metal">Miscellaneous &amp; Architectural Metal</option>
              <option value="architectural-glass">Architectural Glass Systems</option>
              <option value="fabrication-installation">Fabrication &amp; Installation</option>
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filter Results Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm pt-3 border-t border-slate-200">
          <div className="text-slate-600 font-medium">
            Showing <strong className="text-[#0f2b48] font-bold">{filteredProjects.length}</strong> of{' '}
            <strong className="text-[#0f2b48] font-bold">{initialProjects.length}</strong> verified project case studies
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-bold uppercase tracking-wider transition-colors font-condensed"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid or Zero Results */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border-2 border-slate-200 rounded-sm p-8 space-y-4 shadow-sm">
          <p className="text-base font-bold text-[#0f2b48]">
            No projects matched your specific filter criteria.
          </p>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Try adjusting your search terms or clearing your industry and trade filters to view our full project portfolio.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider font-condensed rounded-sm"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
