
import { motion } from "motion/react";
import { ArrowUpRight, Eye, Layers } from "lucide-react";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  index: number;
}

const categoryLabels: Record<string, string> = {
  web: "Web Application",
  mobile: "Mobile Application",
  branding: "Creative Branding",
  experimental: "Experimental",
  game: "Game Development",
};

export default function ProjectCard({
  project,
  onOpen,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[var(--bg)] timbul p-4 transition-all duration-300"
    >
      {/* Cover Proyek */}
      <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--bg)]">
        {project.coverUrl ? (
          <img
            src={project.coverUrl}
            alt={`Cover ${project.title}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover object-center opacity-80 grayscale transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Cover belum tersedia
          </div>
        )}

        {/* Label Kategori */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[var(--bg)] timbul px-2.5 py-1 text-[10px] uppercase tracking-widest text-[var(--aksen)]">
          <Layers className="h-3 w-3" />
          {categoryLabels[project.category] ?? project.category}
        </div>

        {/* Jumlah Views */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-[var(--bg)] timbul px-2 py-0.5 text-[10px] text-zinc-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Eye className="h-3 w-3 text-[var(--aksen)]" />
          <span>{project.views} views</span>
        </div>
      </div>

      {/* Detail Proyek */}
      <div className="flex grow flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-medium tracking-tight text-zinc-100 transition-colors duration-300 group-hover:text-[var(--aksen)]">
            {project.title}
          </h3>

          <span className="shrink-0 rounded-full bg-[var(--bg)] timbul p-1 text-zinc-400 transition-all duration-300 group-hover:text-[var(--aksen)]">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        {project.subtitle && (
          <p className="mt-1 text-xs font-medium text-[var(--aksen)]">
            {project.subtitle}
          </p>
        )}

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2 pt-3">
          {project.tags.slice(0, 3).map((tag, i) => (
            <span
              key={`${project.id}-tag-${i}`}
              className="rounded-lg bg-[var(--bg)] cekung px-2.5 py-1 text-[10px] tracking-tight text-zinc-400 transition-colors hover:text-[var(--aksen)]"
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

      {/* Tombol untuk Membuka Detail */}
      <button
        type="button"
        id={`btn-view-${project.id}`}
        onClick={() => onOpen(project)}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-3xl opacity-0 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--aksen)]"
        aria-label={`Lihat detail proyek ${project.title}`}
      />
    </motion.div>
  );
}
