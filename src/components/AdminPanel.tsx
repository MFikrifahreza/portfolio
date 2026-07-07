import {
  AlertCircle,
  BarChart3,
  Clock,
  Database,
  Edit3,
  Eye,
  Inbox,
  Plus,
  RefreshCw,
  Server,
  Sparkle,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { AnalyticsEvent, ContactMessage, Project } from "../types";

interface AdminPanelProps {
  projects: Project[];
  messages: ContactMessage[];
  events: AnalyticsEvent[];
  activeSeconds: number;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateMessages: (messages: ContactMessage[]) => void;
  onResetProjects: () => void;
  onClose: () => void;
}

export default function AdminPanel({
  projects,
  messages,
  events,
  activeSeconds,
  onUpdateProjects,
  onUpdateMessages,
  onResetProjects,
  onClose,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"cms" | "analytics" | "inbox">(
    "cms",
  );

  // CMS Edit States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Project Form States
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formCategory, setFormCategory] = useState<
    "web" | "mobile" | "branding" | "experimental"
  >("web");
  const [formTags, setFormTags] = useState("");
  const [formTimeline, setFormTimeline] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formWebsiteUrl, setFormWebsiteUrl] = useState("");
  const [formGithubUrl, setFormGithubUrl] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);

  // Authenticate right away on load for preview convenience since it is a client sandbox
  useEffect(() => {
    // We let users type any mock code or default to blank to login instantly to keep it easy!
    setIsAuthenticated(true);
  }, []);

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setIsCreatingNew(false);

    // Fill form states
    setFormTitle(project.title);
    setFormSubtitle(project.subtitle);
    setFormDescription(project.description);
    setFormContent(project.content);
    setFormCoverUrl(project.coverUrl);
    setFormCategory(project.category);
    setFormTags(project.tags.join(", "));
    setFormTimeline(project.timeline);
    setFormRole(project.role);
    setFormClient(project.client || "");
    setFormWebsiteUrl(project.websiteUrl || "");
    setFormGithubUrl(project.githubUrl || "");
    setFormFeatured(project.featured);
  };

  const handleOpenCreateAndInit = () => {
    setEditingProject(null);
    setIsCreatingNew(true);

    // Reset form states
    setFormTitle("");
    setFormSubtitle("");
    setFormDescription("");
    setFormContent(`### Deskripsi Proyek
Jelaskan tujuan dan fungsi utama proyek.

### Fitur Utama
- Login
- Dashboard
- Manajemen Data

### Teknologi yang Digunakan
- Flutter
- Firebase
- Dart

### Hasil Pengembangan
Jelaskan hasil yang telah dicapai dari proyek ini.`);
    setFormCoverUrl("");
    setFormCategory("web");
    setFormTags("Flutter, Firebase, Dart, HTML, CSS, JavaScript");
    setFormTimeline("2026");
    setFormRole("Frontend Developer");
    setFormClient("");
    setFormWebsiteUrl("");
    setFormGithubUrl("");
    setFormFeatured(false);
  };

  const handleSaveProject = (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (isCreatingNew) {
      // Create new
      const newPrj: Project = {
        id:
          formTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `project-${Date.now()}`,
        title: formTitle,
        subtitle: formSubtitle,
        description: formDescription,
        content: formContent,
        coverUrl: formCoverUrl,
        category: formCategory,
        tags: parsedTags,
        timeline: formTimeline,
        role: formRole,
        client: formClient || undefined,
        websiteUrl: formWebsiteUrl || undefined,
        githubUrl: formGithubUrl || undefined,
        featured: formFeatured,
        views: 0,
      };
      onUpdateProjects([newPrj, ...projects]);
    } else if (editingProject) {
      // Update existing
      const updated = projects.map((p) => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            title: formTitle,
            subtitle: formSubtitle,
            description: formDescription,
            content: formContent,
            coverUrl: formCoverUrl,
            category: formCategory,
            tags: parsedTags,
            timeline: formTimeline,
            role: formRole,
            client: formClient || undefined,
            websiteUrl: formWebsiteUrl || undefined,
            githubUrl: formGithubUrl || undefined,
            featured: formFeatured,
          };
        }
        return p;
      });
      onUpdateProjects(updated);
    }

    // Reset view variables
    setIsCreatingNew(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus proyek ini secara permanen dari portofolio?",
      )
    ) {
      const filtered = projects.filter((p) => p.id !== id);
      onUpdateProjects(filtered);
    }
  };

  const handleToggleMessageStatus = (msgId: string) => {
    const updated = messages.map((m) => {
      if (m.id === msgId) {
        return {
          ...m,
          status: (m.status === "unread" ? "read" : "unread") as
            | "read"
            | "unread",
        };
      }
      return m;
    });
    onUpdateMessages(updated);
  };

  const handleDeleteMessage = (msgId: string) => {
    if (confirm("Hapus pesan kontak ini secara permanen?")) {
      const filtered = messages.filter((m) => m.id !== msgId);
      onUpdateMessages(filtered);
    }
  };

  // Compute live analytical statistics
  const totalVisits = events.filter((e) => e.type === "visit").length;
  const projectDetailsTotalViews = events.filter(
    (e) => e.type === "project_view",
  ).length;
  const totalFormSubmits = messages.length;

  // Track counts per project dynamically based on events log
  const projectEngagementList = projects
    .map((p) => {
      const viewsOnEvent = events.filter(
        (e) => e.type === "project_view" && e.detail === p.title,
      ).length;
      return {
        title: p.title,
        views: p.views + viewsOnEvent,
      };
    })
    .sort((a, b) => b.views - a.views);

  const formatSecs = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-white/15 bg-[#0a0b10]/50 backdrop-blur-2xl shadow-2xl shadow-black/60 overflow-hidden focus:outline-none"
      >
        {/* Title bar - Glassmorphism */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4.5">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Server className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Portfolio Dashboard
                <span className="inline-block rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest leading-none">
                  Admin
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">
                Kelola Konten, Analytics & Pesan
              </p>
            </div>
          </div>
          <button
            id="btn-close-admin"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer"
            aria-label="Tutup Administrator"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/10 bg-white/3 backdrop-blur-sm px-3.5 pt-2">
          <button
            id="tab-btn-cms"
            onClick={() => {
              setActiveTab("cms");
              setIsCreatingNew(false);
              setEditingProject(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 tracking-tight transition-all duration-300 font-medium ${
              activeTab === "cms"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Database className="h-4 w-4" />
            Kelola Proyek
          </button>

          <button
            id="tab-btn-analytics"
            onClick={() => {
              setActiveTab("analytics");
              setIsCreatingNew(false);
              setEditingProject(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 tracking-tight transition-all duration-300 font-medium ${
              activeTab === "analytics"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>

          <button
            id="tab-btn-inbox"
            onClick={() => {
              setActiveTab("inbox");
              setIsCreatingNew(false);
              setEditingProject(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 tracking-tight transition-all duration-300 relative font-medium ${
              activeTab === "inbox"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Pesan
            {messages.filter((m) => m.status === "unread").length > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/90 px-1 text-[9px] font-bold text-black font-mono">
                {messages.filter((m) => m.status === "unread").length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0a0b10]">
          {/* TAB 1: CMS SECTION */}
          {activeTab === "cms" && (
            <div id="cms-tab-content">
              {!isCreatingNew && !editingProject ? (
                <div>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-md font-display font-semibold text-white">
                        Daftar Portofolio
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Kelola deskripsi, cover, tag, dan metadata proyek.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        id="btn-cms-reset"
                        onClick={onResetProjects}
                        className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-mono text-zinc-300 transition-all duration-300 cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reset
                      </button>
                      <button
                        id="btn-cms-add"
                        onClick={handleOpenCreateAndInit}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-black transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Proyek
                      </button>
                    </div>
                  </div>

                  {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl py-14 text-center bg-white/3 backdrop-blur-sm">
                      <AlertCircle className="h-10 w-10 text-zinc-600 mb-3" />
                      <p className="text-sm text-zinc-300 font-medium">
                        Belum ada proyek.
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Klik 'Tambah Proyek' atau 'Reset' untuk memulai.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white/8 hover:border-white/15"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 border border-white/20">
                              <img
                                src={project.coverUrl}
                                alt={project.title}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {project.title}
                                </h4>
                                <span className="rounded bg-white/15 border border-white/20 text-zinc-300 px-1.5 py-0.5 text-[9px] font-mono uppercase">
                                  {project.category}
                                </span>
                                {project.featured && (
                                  <span className="rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 text-[9px] font-mono">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-md">
                                {project.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 ml-4">
                            <button
                              id={`btn-edit-project-${project.id}`}
                              onClick={() => handleOpenEdit(project)}
                              className="rounded p-2 text-zinc-400 hover:bg-white/15 hover:text-white transition-all duration-300 cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              id={`btn-delete-project-${project.id}`}
                              onClick={() => handleDeleteProject(project.id)}
                              className="rounded p-2 text-zinc-500 hover:bg-red-500/15 hover:text-red-400 transition-all duration-300 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* FORM ADD / UPDATE PROJECTS */
                <form
                  id="project-cms-form"
                  onSubmit={handleSaveProject}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-display font-semibold text-md text-emerald-400">
                      {isCreatingNew ? "Proyek Baru" : `Edit: ${formTitle}`}
                    </h3>
                    <button
                      type="button"
                      id="btn-cancel-form"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProject(null);
                      }}
                      className="text-xs font-mono text-zinc-400 hover:text-white transition-colors duration-300"
                    >
                      Batalkan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="form_title"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Judul
                      </label>
                      <input
                        type="text"
                        id="form_title"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Contoh: Portfolio Web"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label
                        htmlFor="form_subtitle"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Sub-judul
                      </label>
                      <input
                        type="text"
                        id="form_subtitle"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="Deskripsi singkat..."
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="form_desc"
                      className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                    >
                      Deskripsi Singkat
                    </label>
                    <input
                      type="text"
                      id="form_desc"
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Ringkasan dalam satu kalimat..."
                      className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                      <label
                        htmlFor="form_cat"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Kategori
                      </label>
                      <select
                        id="form_cat"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      >
                        <option value="web">Web Application</option>
                        <option value="mobile">Mobile Application</option>
                        <option value="branding">Creative Branding</option>
                        <option value="experimental">Experimental</option>
                      </select>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label
                        htmlFor="form_timeline"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Timeline
                      </label>
                      <input
                        type="text"
                        id="form_timeline"
                        value={formTimeline}
                        onChange={(e) => setFormTimeline(e.target.value)}
                        placeholder="Contoh: Maret - Mei 2026"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label
                        htmlFor="form_tags"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Tags (Pisah koma)
                      </label>
                      <input
                        type="text"
                        id="form_tags"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="React, Web3, Framer"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role */}
                    <div>
                      <label
                        htmlFor="form_role"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Peran Saya
                      </label>
                      <input
                        type="text"
                        id="form_role"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="Frontend Developer"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>

                    {/* Client */}
                    <div>
                      <label
                        htmlFor="form_client"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Klien (Opsional)
                      </label>
                      <input
                        type="text"
                        id="form_client"
                        value={formClient}
                        onChange={(e) => setFormClient(e.target.value)}
                        placeholder="Universitas Pamulang"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Cover Image Selection */}
                  {/* Cover Image Selection - Manual Local File */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-2">
                      Cover Proyek
                    </label>

                    {/* Preview */}
                    <div className="mb-3 aspect-[16/9] w-full max-w-xs overflow-hidden rounded-lg border border-white/15 bg-white/5">
                      {formCoverUrl ? (
                        <img
                          src={formCoverUrl}
                          alt="Preview cover"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.opacity =
                              "0.3";
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-500 font-mono">
                          Belum ada cover
                        </div>
                      )}
                    </div>

                    {/* Path Input */}
                    <input
                      type="text"
                      id="form_cover_url"
                      required
                      value={formCoverUrl}
                      onChange={(e) => setFormCoverUrl(e.target.value)}
                      placeholder="/projects/projek2.png"
                      className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                      Taruh file gambar di folder{" "}
                      <code className="text-emerald-400">public/projects/</code>
                      , lalu ketik path-nya di sini. Contoh:{" "}
                      <code className="text-emerald-400">
                        /projects/portfolio-web.jpg
                      </code>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Website URL */}
                    <div>
                      <label
                        htmlFor="form_web_url"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        Demo Website URL
                      </label>
                      <input
                        type="url"
                        id="form_web_url"
                        value={formWebsiteUrl}
                        onChange={(e) => setFormWebsiteUrl(e.target.value)}
                        placeholder="https://demo.com"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>

                    {/* GitHub URL */}
                    <div>
                      <label
                        htmlFor="form_git_url"
                        className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5"
                      >
                        GitHub Repository
                      </label>
                      <input
                        type="url"
                        id="form_git_url"
                        value={formGithubUrl}
                        onChange={(e) => setFormGithubUrl(e.target.value)}
                        placeholder="https://github.com/user/repo"
                        className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="form_content"
                        className="block text-[11px] font-mono uppercase text-zinc-400"
                      >
                        Konten Detail
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Markdown supported
                      </span>
                    </div>
                    <textarea
                      id="form_content"
                      required
                      rows={6}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-white/5 backdrop-blur-sm px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all duration-300"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-3">
                    <input
                      type="checkbox"
                      id="form_featured"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="h-4.5 w-4.5 accent-emerald-500 bg-white/10 border-white/20 rounded focus:ring-0"
                    />
                    <div>
                      <label
                        htmlFor="form_featured"
                        className="text-xs font-semibold text-white cursor-pointer"
                      >
                        Sematkan sebagai Featured
                      </label>
                      <p className="text-[10px] text-zinc-400">
                        Tampilkan di bagian highlight utama.
                      </p>
                    </div>
                  </div>

                  {/* Save buttons */}
                  <div className="flex justify-end gap-2.5 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      id="btn-form-cancel-bottom"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProject(null);
                      }}
                      className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 px-5 py-2.5 text-xs font-semibold text-zinc-300 transition-all duration-300 cursor-pointer"
                    >
                      Batalkan
                    </button>
                    <button
                      type="submit"
                      id="btn-form-save-project"
                      className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      Simpan Proyek
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: LIVE ANALYTICS */}
          {activeTab === "analytics" && (
            <div id="analytics-tab-content" className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-emerald-400" /> Kunjungan
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold font-mono text-emerald-400">
                      {totalVisits + 1}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Page views
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />{" "}
                    Engagement
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold font-mono text-emerald-400">
                      {projectDetailsTotalViews}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Project views
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Inbox className="h-3 w-3 text-emerald-400" /> Pesan
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold font-mono text-emerald-400">
                      {totalFormSubmits}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Submissions
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-emerald-400" /> Session
                  </span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold font-mono text-zinc-200 tracking-tight">
                      {formatSecs(activeSeconds)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Elapsed time
                    </span>
                  </div>
                </div>
              </div>

              {/* Engagement Chart */}
              <div className="rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl p-5">
                <h4 className="font-display font-semibold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <Sparkle className="h-4 w-4 text-emerald-400" /> Engagement
                  Per Proyek
                </h4>
                <div className="space-y-3.5">
                  {projectEngagementList.map((p, index) => {
                    const maxCount = Math.max(
                      ...projectEngagementList.map((item) => item.views),
                      1,
                    );
                    const percent = Math.round((p.views / maxCount) * 100);

                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-zinc-300 truncate max-w-sm">
                            {p.title}
                          </span>
                          <span className="text-emerald-400 font-semibold">
                            {p.views} views
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-white/5 backdrop-blur-sm overflow-hidden border border-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400/70"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="rounded-lg border border-white/15 bg-white/8 backdrop-blur-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-semibold text-sm text-zinc-200 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    Aktivitas langsung
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Real-time
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2.5 rounded-lg bg-black/30 border border-white/10 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-400">
                  {events.length === 0 ? (
                    <p className="text-center text-zinc-600 py-4">
                      Aktivitas akan muncul di sini.
                    </p>
                  ) : (
                    events.map((evt) => {
                      let typeLabel = "";
                      let typeColor = "text-zinc-500";

                      switch (evt.type) {
                        case "visit":
                          typeLabel = "[VISIT]";
                          typeColor = "text-blue-400";
                          break;
                        case "project_view":
                          typeLabel = "[ENGAGE]";
                          typeColor = "text-amber-400";
                          break;
                        case "contact_open":
                          typeLabel = "[FORM]";
                          typeColor = "text-indigo-400";
                          break;
                        case "contact_submit":
                          typeLabel = "[SUBMIT]";
                          typeColor = "text-emerald-400 font-semibold";
                          break;
                        default:
                          typeLabel = "[EVENT]";
                      }

                      return (
                        <div
                          key={evt.id}
                          className="flex items-start gap-2 border-b border-white/5 pb-1.5 last:border-0 last:pb-0"
                        >
                          <span className="text-[10px] text-zinc-600 flex-shrink-0">
                            {evt.timestamp}
                          </span>
                          <span
                            className={`${typeColor} uppercase flex-shrink-0`}
                          >
                            {typeLabel}
                          </span>
                          <span className="text-zinc-300">{evt.detail}</span>
                          {evt.device && (
                            <span className="text-[10px] text-emerald-500/50 ml-auto flex-shrink-0">
                              ({evt.device})
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INBOX */}
          {activeTab === "inbox" && (
            <div id="inbox-tab-content">
              <div className="mb-4">
                <h3 className="text-md font-display font-semibold text-white">
                  Pesan Masuk
                </h3>
                <p className="text-xs text-zinc-400">
                  Pesan dari formulir kontak portofolio Anda.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg py-14 text-center bg-white/3 backdrop-blur-sm">
                  <Inbox className="h-10 w-10 text-zinc-600 mb-3" />
                  <p className="text-sm text-zinc-300 font-medium">
                    Kotak Masuk Kosong
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Belum ada pesan dari pengunjung.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg border p-4 transition-all duration-300 ${
                        msg.status === "unread"
                          ? "border-emerald-500/40 bg-emerald-500/10 backdrop-blur-sm"
                          : "border-white/10 bg-white/5 backdrop-blur-sm"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {msg.name}
                            </span>
                            <span className="text-xs text-emerald-400 font-mono">
                              ({msg.email})
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-amber-400 block">
                            Subj: {msg.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <span className="text-[10px] font-mono text-zinc-500 mr-1.5">
                            {msg.timestamp}
                          </span>
                          <button
                            id={`btn-read-toggle-${msg.id}`}
                            onClick={() => handleToggleMessageStatus(msg.id)}
                            className={`rounded px-2.5 py-1 text-[10px] font-mono transition-all duration-300 border cursor-pointer ${
                              msg.status === "unread"
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                                : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {msg.status === "unread" ? "Baca" : "Unread"}
                          </button>
                          <button
                            id={`btn-delete-msg-${msg.id}`}
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="rounded p-1.5 border border-white/10 text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="mt-3 border-t border-white/10 bg-black/20 rounded-lg p-3 text-xs leading-relaxed text-zinc-300 font-sans">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4.5 flex items-center justify-between">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Online
          </p>
          <p className="text-[10px] font-mono text-zinc-550">
            MFIzaaa Portfolio Admin • V1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
