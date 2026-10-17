import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ArrowUpRight, Layers, Eye } from 'lucide-react';

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
}

export default function ProjectCard({ project, onOpen, index }: ProjectCardProps) {
  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[var(--bg)] timbul p-4 transition-all duration-300"
    >
      {/* Visual Header / Thumbnail */}
      <div className="relative mb-5 overflow-hidden rounded-2xl aspect-16/10 bg-[var(--bg)]">
        <img
          src={project.coverUrl}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center grayscale opacity-80 transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 "
        />
        
        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[var(--bg)] timbul px-2.5 py-1 text-[10px] tracking-widest uppercase text-[var(--aksen)]">
          <Layers className="h-3 w-3" />
          {project.category}
        </div>

        {/* Total views badge overlay on hover */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-[var(--bg)] timbul px-2 py-0.5 text-[10px] text-zinc-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Eye className="h-3 w-3 text-[var(--aksen)]" />
          <span>{project.views} views</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col grow">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl font-medium text-zinc-100 tracking-tight group-hover:text-[var(--aksen)] transition-colors duration-300">
            {project.title}
          </h3>
          <span className="p-1 rounded-full bg-[var(--bg)] timbul text-zinc-400 group-hover:text-[var(--aksen)] transition-all duration-300">
            <ArrowUpRight className="h-4.5 w-4.5 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        
        <p className="mt-2 text-sm text-zinc-400 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tags List */}
        <div className="mt-4 flex flex-wrap gap-2 pt-3">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="rounded-lg bg-[var(--bg)] cekung px-2.5 py-1 text-[10px] text-zinc-400 tracking-tight hover:text-[var(--aksen)] transition-colors"
            >
              #{tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="rounded-lg bg-[var(--bg)] cekung px-2.5 py-1 text-[10px] text-zinc-500">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Form Interaction Overlay Button for Accessibility */}
      <button
        id={`btn-view-${project.id}`}
        onClick={() => onOpen(project)}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        aria-label={`View details of ${project.title}`}
      />
    </motion.div>
  );
}