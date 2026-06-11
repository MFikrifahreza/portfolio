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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-300 hover:border-zinc-700/80 hover:bg-zinc-900/90 hover:shadow-2xl hover:shadow-black/60 focus-within:ring-2 focus-within:ring-emerald-500/50"
    >
      {/* Visual Header / Thumbnail */}
      <div className="relative mb-5 overflow-hidden rounded-xl aspect-16/10 bg-zinc-950">
        <img
          src={project.coverUrl}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center grayscale opacity-80 transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
        />
        
        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono tracking-widest uppercase text-emerald-400 border border-zinc-800">
          <Layers className="h-3 w-3" />
          {project.category}
        </div>

        {/* Total views badge overlay on hover */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/65 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Eye className="h-3 w-3 text-emerald-400" />
          <span>{project.views} views</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-xl font-medium text-zinc-100 tracking-tight group-hover:text-amber-400/95 transition-colors duration-300">
            {project.title}
          </h3>
          <span className="p-1 rounded-full bg-zinc-800/60 text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-950/40 transition-all duration-300">
            <ArrowUpRight className="h-4.5 w-4.5 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
        
        <p className="mt-2 text-sm text-zinc-400 font-sans line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tags List */}
        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800/40">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="rounded-md bg-zinc-800/40 px-2 py-0.5 text-[10px] font-mono text-zinc-400 tracking-tight hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="rounded-md bg-zinc-800/20 px-1.5 py-0.5 text-[10px] font-mono text-zinc-500">
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
