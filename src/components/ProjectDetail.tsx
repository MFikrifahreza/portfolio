import { motion } from 'motion/react';
import { Project } from '../types';
import { X, Calendar, User, Globe, Github, Tag, Eye } from 'lucide-react';

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  if (!project) return null;

  // Custom parser to split markdown content into clean components dynamically
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('###')) {
        // Heading level 3
        return (
          <h4 key={idx} className="mt-8 mb-3 font-display text-lg font-semibold text-emerald-300 tracking-tight first:mt-2">
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }

      if (trimmed.startsWith('##')) {
        // Heading level 2
        return (
          <h3 key={idx} className="mt-10 mb-4 font-display text-xl font-bold text-amber-400 tracking-tight">
            {trimmed.replace('##', '').trim()}
          </h3>
        );
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // Bullet list item
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-zinc-300 leading-relaxed mb-1.5 pl-1">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        // Numbered list item
        const match = trimmed.match(/^(\d+\.\s)(.*)/);
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-zinc-300 leading-relaxed mb-2 pl-1">
            <span className="font-mono text-emerald-400 font-medium mr-1">{match ? match[1] : ''}</span>
            {match ? match[2] : trimmed}
          </li>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="text-sm text-zinc-300 leading-relaxed mb-4 font-sans text-justify">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/75 backdrop-blur-sm">
      {/* Click outside backdrop close layer */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Panel slider */}
      <motion.div
        id="project-detail-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl shadow-black focus:outline-none"
      >
        {/* Detail Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900/40">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400">
              {project.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <span>{project.views} views</span>
            </span>
          </div>
          <button
            id="btn-close-detail"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Main Title */}
          <h2 className="font-display text-3xl font-bold text-white tracking-tight leading-tight">
            {project.title}
          </h2>
          <p className="mt-2 text-md text-amber-400/90 font-medium font-sans">
            {project.subtitle}
          </p>

          {/* Large Cover Hero */}
          <div className="mt-6 aspect-[16/10] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <img
              src={project.coverUrl}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Metadata Table layout */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-zinc-900 bg-zinc-900/30 p-4.5 font-sans md:grid-cols-4">
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <Calendar className="h-3 w-3" /> Timeline
              </span>
              <span className="mt-1 text-xs text-zinc-300 font-medium">{project.timeline}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <User className="h-3 w-3" /> Client
              </span>
              <span className="mt-1 text-xs text-zinc-300 font-medium">{project.client || 'Personal Lab'}</span>
            </div>

            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <Tag className="h-3 w-3" /> My Role
              </span>
              <span className="mt-1 text-xs text-zinc-200 font-medium leading-tight">{project.role}</span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Action Links</span>
              <div className="flex items-center gap-2">
                {project.websiteUrl && (
                  <a
                    id="link-project-web"
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded bg-zinc-800 hover:bg-emerald-600 hover:text-white px-2 py-1 text-xs text-zinc-300 font-medium transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" /> Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    id="link-project-git"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="View Source on GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Formatted Content block */}
          <div className="mt-8 border-t border-zinc-900 pt-6">
            <div className="prose prose-invert max-w-none">
              {renderFormattedContent(project.content)}
            </div>
          </div>
        </div>

        {/* Footer info lock */}
        <div className="border-t border-zinc-800 px-6 py-4.5 bg-zinc-950/80 text-center">
          <p className="text-[11px] font-mono text-zinc-500">
            CDM Studio Project Catalog • Terakhir Diperbarui {project.timeline}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
