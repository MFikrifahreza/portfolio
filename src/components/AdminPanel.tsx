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


const CATEGORY_LABELS: Record<string, string> = {
  web: "Web Application",
  mobile: "Mobile Application",
  branding: "Creative Branding",
  experimental: "Experimental",
  game: "Game Development",
};


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
  "web" | "mobile" | "branding" | "experimental" | "game"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141722]/80 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-3xl bg-[var(--bg)] timbul overflow-hidden focus:outline-none"
      >
        {/* Title bar */}
        <div className="relative z-10 flex items-center justify-between bg-[var(--bg)] timbul px-6 py-4.5">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-[var(--bg)] timbul text-[var(--aksen)]">
              <Server className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Portfolio Dashboard
                <span className="inline-block rounded-full bg-[var(--bg)] cekung text-[var(--aksen)] px-2 py-0.5 text-[10px] uppercase tracking-widest leading-none">
                  Admin
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                Kelola Konten, Analytics & Pesan
              </p>
            </div>
          </div>
          <button
            id="btn-close-admin"
            onClick={onClose}
            className="tombol rounded-xl p-2 bg-[var(--bg)] timbul text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer"
            aria-label="Tutup Administrator"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-[var(--bg)] px-3.5 py-3">
          <button
            id="tab-btn-cms"
            onClick={() => {
              setActiveTab("cms");
              setIsCreatingNew(false);
              setEditingProject(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl tracking-tight transition-all duration-300 font-medium ${
              activeTab === "cms"
                ? "bg-[var(--bg)] timbul text-[var(--aksen)]"
                : "text-zinc-400 hover:text-zinc-200"
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
            className={`flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl tracking-tight transition-all duration-300 font-medium ${
              activeTab === "analytics"
                ? "bg-[var(--bg)] timbul text-[var(--aksen)]"
                : "text-zinc-400 hover:text-zinc-200"
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
            className={`flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl tracking-tight transition-all duration-300 relative font-medium ${
              activeTab === "inbox"
                ? "bg-[var(--bg)] timbul text-[var(--aksen)]"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Inbox className="h-4 w-4" />
            Pesan
            {messages.filter((m) => m.status === "unread").length > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--aksen)] px-1 text-[9px] font-bold text-white">
                {messages.filter((m) => m.status === "unread").length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg)]">
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
                    <div className="flex gap-3">
                      <button
                        id="btn-cms-reset"
                        onClick={onResetProjects}
                        className="tombol flex items-center gap-1.5 rounded-xl bg-[var(--bg)] timbul px-3.5 py-2 text-xs text-zinc-300 transition-all duration-300 cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reset
                      </button>
                      <button
                        id="btn-cms-add"
                        onClick={handleOpenCreateAndInit}
                        className="tombol flex items-center gap-1.5 rounded-xl bg-[var(--bg)] timbul px-4 py-2 text-xs font-semibold text-[var(--aksen)] transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        Tambah Proyek
                      </button>
                    </div>
                  </div>

                  {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl py-14 text-center bg-[var(--bg)] cekung">
                      <AlertCircle className="h-10 w-10 text-zinc-600 mb-3" />
                      <p className="text-sm text-zinc-300 font-medium">
                        Belum ada proyek.
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Klik 'Tambah Proyek' atau 'Reset' untuk memulai.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between rounded-2xl bg-[var(--bg)] timbul p-4 transition-all duration-300"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--bg)] cekung">
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
                                <span className="rounded-lg bg-[var(--bg)] cekung text-zinc-300 px-1.5 py-0.5 text-[9px] uppercase">
                                  {CATEGORY_LABELS[project.category] ?? project.category}
                                </span>
                                {project.featured && (
                                  <span className="rounded-lg bg-[var(--bg)] cekung text-[var(--aksen)] px-1.5 py-0.5 text-[9px]">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-md">
                                {project.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <button
                              id={`btn-edit-project-${project.id}`}
                              onClick={() => handleOpenEdit(project)}
                              className="tombol rounded-xl p-2 bg-[var(--bg)] timbul text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              id={`btn-delete-project-${project.id}`}
                              onClick={() => handleDeleteProject(project.id)}
                              className="tombol rounded-xl p-2 bg-[var(--bg)] timbul text-zinc-500 hover:text-red-400 transition-all duration-300 cursor-pointer"
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
                  <div className="flex items-center justify-between pb-3">
                    <h3 className="font-display font-semibold text-md text-[var(--aksen)]">
                      {isCreatingNew ? "Proyek Baru" : `Edit: ${formTitle}`}
                    </h3>
                    <button
                      type="button"
                      id="btn-cancel-form"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProject(null);
                      }}
                      className="text-xs text-zinc-400 hover:text-white transition-colors duration-300"
                    >
                      Batalkan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label
                        htmlFor="form_title"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
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
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label
                        htmlFor="form_subtitle"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Sub-judul
                      </label>
                      <input
                        type="text"
                        id="form_subtitle"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="Deskripsi singkat..."
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="form_desc"
                      className="block text-[11px] uppercase text-zinc-400 mb-1.5"
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
                      className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                      <label
                        htmlFor="form_cat"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Kategori
                      </label>
                      <select
                        id="form_cat"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      >
                        
<option value="web">Web Application</option>
<option value="mobile">Mobile Application</option>
<option value="branding">Creative Branding</option>
<option value="experimental">Experimental</option>
<option value="game">Game Development</option>

                      </select>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label
                        htmlFor="form_timeline"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Timeline
                      </label>
                      <input
                        type="text"
                        id="form_timeline"
                        value={formTimeline}
                        onChange={(e) => setFormTimeline(e.target.value)}
                        placeholder="Contoh: Maret - Mei 2026"
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label
                        htmlFor="form_tags"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Tags (Pisah koma)
                      </label>
                      <input
                        type="text"
                        id="form_tags"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="React, Web3, Framer"
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Role */}
                    <div>
                      <label
                        htmlFor="form_role"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Peran Saya
                      </label>
                      <input
                        type="text"
                        id="form_role"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="Frontend Developer"
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>

                    {/* Client */}
                    <div>
                      <label
                        htmlFor="form_client"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Klien (Opsional)
                      </label>
                      <input
                        type="text"
                        id="form_client"
                        value={formClient}
                        onChange={(e) => setFormClient(e.target.value)}
                        placeholder="Universitas Pamulang"
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Cover Image Selection */}
                  {/* Cover Image Selection - Manual Local File */}
                  <div>
                    <label className="block text-[11px] uppercase text-zinc-400 mb-2">
                      Cover Proyek
                    </label>

                    {/* Preview */}
                    <div className="mb-3 aspect-video w-full max-w-xs overflow-hidden rounded-xl bg-[var(--bg)] cekung">
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
                        <div className="flex h-full items-center justify-center text-xs text-zinc-500">
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
                      className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                      Taruh file gambar di folder{" "}
                      <code className="text-[var(--aksen)]">public/projects/</code>
                      , lalu ketik path-nya di sini. Contoh:{" "}
                      <code className="text-[var(--aksen)]">
                        /projects/portfolio-web.jpg
                      </code>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Website URL */}
                    <div>
                      <label
                        htmlFor="form_web_url"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        Demo Website URL
                      </label>
                      <input
                        type="url"
                        id="form_web_url"
                        value={formWebsiteUrl}
                        onChange={(e) => setFormWebsiteUrl(e.target.value)}
                        placeholder="https://demo.com"
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>

                    {/* GitHub URL */}
                    <div>
                      <label
                        htmlFor="form_git_url"
                        className="block text-[11px] uppercase text-zinc-400 mb-1.5"
                      >
                        GitHub Repository
                      </label>
                      <input
                        type="url"
                        id="form_git_url"
                        value={formGithubUrl}
                        onChange={(e) => setFormGithubUrl(e.target.value)}
                        placeholder="https://github.com/user/repo"
                        className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white placeholder-zinc-500 outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label
                        htmlFor="form_content"
                        className="block text-[11px] uppercase text-zinc-400"
                      >
                        Konten Detail
                      </label>
                      <span className="text-[10px] text-zinc-500">
                        Markdown supported
                      </span>
                    </div>
                    <textarea
                      id="form_content"
                      required
                      rows={6}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full rounded-xl bg-[var(--bg)] cekung px-3.5 py-2 text-sm text-white outline outline-1 outline-transparent focus:outline-[var(--aksen)] transition-all duration-300"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center gap-2 rounded-xl bg-[var(--bg)] cekung p-3">
                    <input
                      type="checkbox"
                      id="form_featured"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="h-4.5 w-4.5 accent-[var(--aksen)] rounded focus:ring-0"
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
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      id="btn-form-cancel-bottom"
                      onClick={() => {
                        setIsCreatingNew(false);
                        setEditingProject(null);
                      }}
                      className="tombol rounded-xl bg-[var(--bg)] timbul px-5 py-2.5 text-xs font-semibold text-zinc-300 transition-all duration-300 cursor-pointer"
                    >
                      Batalkan
                    </button>
                    <button
                      type="submit"
                      id="btn-form-save-project"
                      className="tombol rounded-xl bg-[var(--bg)] timbul px-6 py-2.5 text-xs font-bold text-[var(--aksen)] transition-all duration-300 cursor-pointer"
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
                <div className="rounded-2xl bg-[var(--bg)] timbul p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="h-3 w-3 text-[var(--aksen)]" /> Kunjungan
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold text-[var(--aksen)]">
                      {totalVisits + 1}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Page views
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--bg)] timbul p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-[var(--aksen)]" />{" "}
                    Engagement
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold text-[var(--aksen)]">
                      {projectDetailsTotalViews}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Project views
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--bg)] timbul p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Inbox className="h-3 w-3 text-[var(--aksen)]" /> Pesan
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold text-[var(--aksen)]">
                      {totalFormSubmits}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Submissions
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[var(--bg)] timbul p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-[var(--aksen)]" /> Session
                  </span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold text-zinc-200 tracking-tight">
                      {formatSecs(activeSeconds)}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Elapsed time
                    </span>
                  </div>
                </div>
              </div>

              {/* Engagement Chart */}
              <div className="rounded-2xl bg-[var(--bg)] timbul p-5">
                <h4 className="font-display font-semibold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <Sparkle className="h-4 w-4 text-[var(--aksen)]" /> Engagement
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
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-300 truncate max-w-sm">
                            {p.title}
                          </span>
                          <span className="text-[var(--aksen)] font-semibold">
                            {p.views} views
                          </span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-[var(--bg)] cekung overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-[var(--aksen)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="rounded-2xl bg-[var(--bg)] timbul p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-semibold text-sm text-zinc-200 flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-[var(--aksen)]" />
                    Aktivitas langsung
                  </h4>
                  <span className="text-[10px] text-zinc-500">
                    Real-time
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2.5 rounded-xl bg-[var(--bg)] cekung p-3.5 text-[11px] leading-relaxed text-zinc-400">
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
                          typeColor = "text-[var(--aksen)] font-semibold";
                          break;
                        default:
                          typeLabel = "[EVENT]";
                      }

                      return (
                        <div
                          key={evt.id}
                          className="flex items-start gap-2 border-b border-white/5 pb-1.5 last:border-0 last:pb-0"
                        >
                          <span className="text-[10px] text-zinc-600 shrink-0">
                            {evt.timestamp}
                          </span>
                          <span
                            className={`${typeColor} uppercase shrink-0`}
                          >
                            {typeLabel}
                          </span>
                          <span className="text-zinc-300">{evt.detail}</span>
                          {evt.device && (
                            <span className="text-[10px] text-zinc-500 ml-auto shrink-0">
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
                <div className="flex flex-col items-center justify-center rounded-2xl py-14 text-center bg-[var(--bg)] cekung">
                  <Inbox className="h-10 w-10 text-zinc-600 mb-3" />
                  <p className="text-sm text-zinc-300 font-medium">
                    Kotak Masuk Kosong
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Belum ada pesan dari pengunjung.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-2xl bg-[var(--bg)] p-4 transition-all duration-300 ${
                        msg.status === "unread" ? "timbul" : "cekung"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {msg.name}
                            </span>
                            <span className="text-xs text-[var(--aksen)]">
                              ({msg.email})
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-200 block">
                            Subj: {msg.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <span className="text-[10px] text-zinc-500 mr-1.5">
                            {msg.timestamp}
                          </span>
                          <button
                            id={`btn-read-toggle-${msg.id}`}
                            onClick={() => handleToggleMessageStatus(msg.id)}
                            className={`tombol rounded-lg bg-[var(--bg)] px-2.5 py-1 text-[10px] transition-all duration-300 cursor-pointer ${
                              msg.status === "unread"
                                ? "timbul text-[var(--aksen)]"
                                : "cekung text-zinc-400 hover:text-white"
                            }`}
                          >
                            {msg.status === "unread" ? "Baca" : "Unread"}
                          </button>
                          <button
                            id={`btn-delete-msg-${msg.id}`}
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="tombol rounded-lg p-1.5 bg-[var(--bg)] timbul text-zinc-400 hover:text-red-400 transition-all duration-300 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="mt-3 bg-[var(--bg)] cekung rounded-xl p-3 text-xs leading-relaxed text-zinc-300">
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
        <div className="bg-[var(--bg)] cekung px-6 py-4.5 flex items-center justify-between">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--aksen)]" />
            Online
          </p>
          <p className="text-[10px] text-zinc-500">
            MFIzaaa Portfolio Admin • V1.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}