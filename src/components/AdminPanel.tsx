import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ContactMessage, AnalyticsEvent } from '../types';
import { 
  Database, BarChart3, Inbox, Trash2, Edit3, Plus, RefreshCw, X, 
  Check, Eye, Sparkles, AlertCircle, Clock, CheckSquare, Layers, 
  Map, Globe, Github, Info, TrendingUp, Sparkle, Server
} from 'lucide-react';

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

const PRESET_COVERS = [
  { name: 'Abstract Cyber Green', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Sleek Metal Phone', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Minimal Mono Dark', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Cyberpunk Neon Wave', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Workspace Flatlay', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Golden Hour Mountain', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' }
];

export default function AdminPanel({
  projects,
  messages,
  events,
  activeSeconds,
  onUpdateProjects,
  onUpdateMessages,
  onResetProjects,
  onClose
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'cms' | 'analytics' | 'inbox'>('cms');
  
  // CMS Edit States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Project Form States
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverUrl, setFormCoverUrl] = useState(PRESET_COVERS[0].url);
  const [formCategory, setFormCategory] = useState<'web' | 'mobile' | 'branding' | 'experimental'>('web');
  const [formTags, setFormTags] = useState('');
  const [formTimeline, setFormTimeline] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formWebsiteUrl, setFormWebsiteUrl] = useState('');
  const [formGithubUrl, setFormGithubUrl] = useState('');
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
    setFormTags(project.tags.join(', '));
    setFormTimeline(project.timeline);
    setFormRole(project.role);
    setFormClient(project.client || '');
    setFormWebsiteUrl(project.websiteUrl || '');
    setFormGithubUrl(project.githubUrl || '');
    setFormFeatured(project.featured);
  };

  const handleOpenCreateAndInit = () => {
    setEditingProject(null);
    setIsCreatingNew(true);
    
    // Reset form states
    setFormTitle('');
    setFormSubtitle('');
    setFormDescription('');
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
    setFormCoverUrl(PRESET_COVERS[0].url);
    setFormCategory('web');
    setFormTags('Flutter, Firebase, Dart, HTML, CSS, JavaScript');
    setFormTimeline('2026');
    setFormRole('Frontend Developer');
    setFormClient('');
    setFormWebsiteUrl('');
    setFormGithubUrl('');
    setFormFeatured(false);
  };

  const handleSaveProject = (e: FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (isCreatingNew) {
      // Create new
      const newPrj: Project = {
        id: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`,
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
        views: 0
      };
      onUpdateProjects([newPrj, ...projects]);
    } else if (editingProject) {
      // Update existing
      const updated = projects.map(p => {
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
            featured: formFeatured
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
    if (confirm('Apakah Anda yakin ingin menghapus proyek ini secara permanen dari portofolio?')) {
      const filtered = projects.filter(p => p.id !== id);
      onUpdateProjects(filtered);
    }
  };

  const handleToggleMessageStatus = (msgId: string) => {
    const updated = messages.map(m => {
      if (m.id === msgId) {
        return { ...m, status: (m.status === 'unread' ? 'read' : 'unread') as 'read' | 'unread' };
      }
      return m;
    });
    onUpdateMessages(updated);
  };

  const handleDeleteMessage = (msgId: string) => {
    if (confirm('Hapus pesan kontak ini secara permanen?')) {
      const filtered = messages.filter(m => m.id !== msgId);
      onUpdateMessages(filtered);
    }
  };

  // Compute live analytical statistics
  const totalVisits = events.filter(e => e.type === 'visit').length;
  const projectDetailsTotalViews = events.filter(e => e.type === 'project_view').length;
  const totalFormSubmits = messages.length;

  // Track counts per project dynamically based on events log
  const projectEngagementList = projects.map(p => {
    const viewsOnEvent = events.filter(e => e.type === 'project_view' && e.detail === p.title).length;
    return {
      title: p.title,
      views: p.views + viewsOnEvent
    };
  }).sort((a,b) => b.views - a.views);

  const formatSecs = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950/95 shadow-2xl overflow-hidden focus:outline-none"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/50 px-6 py-4.5">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Server className="h-5 w-5 animate-pulse" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                MFizaa Portfolio Dashboard
                <span className="inline-block rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest leading-none">
                  Owner
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono">Kelola Proyek, Statistik Pengunjung, dan Pesan Kontak</p>
            </div>
          </div>
          <button
            id="btn-close-admin"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Administrator"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector Links */}
        <div className="flex border-b border-zinc-900 bg-zinc-950 px-3.5 pt-2">
          <button
            id="tab-btn-cms"
            onClick={() => { setActiveTab('cms'); setIsCreatingNew(false); setEditingProject(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 tracking-tight transition-all font-medium ${
              activeTab === 'cms'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="h-4 w-4" />
            Kelola Proyek (CMS)
          </button>
          
          <button
            id="tab-btn-analytics"
            onClick={() => { setActiveTab('analytics'); setIsCreatingNew(false); setEditingProject(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 tracking-tight transition-all font-medium ${
              activeTab === 'analytics'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Live Analytics
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          </button>

          <button
            id="tab-btn-inbox"
            onClick={() => { setActiveTab('inbox'); setIsCreatingNew(false); setEditingProject(null); }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 tracking-tight transition-all relative font-medium ${
              activeTab === 'inbox'
                ? 'border-emerald-500 text-emerald-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Inbox className="h-4 w-4" />
            Pesan Masuk
            {messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="absolute top-2 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-black font-mono">
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          
          {/* TAB 1: CMS SECTION */}
          {activeTab === 'cms' && (
            <div id="cms-tab-content">
              {!isCreatingNew && !editingProject ? (
                <div>
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-md font-display font-semibold text-white">
                        Daftar Portofolio Aktif
                      </h3>
                      <p className="text-xs text-zinc-500">Anda dapat mengubah deskripsi, mengganti cover, menambahkan tag, atau menghapus item berikut.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        id="btn-cms-reset"
                        onClick={onResetProjects}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-white px-3.5 py-2 text-xs font-mono text-zinc-400 transition-colors cursor-pointer"
                        title="Reset projects state to initial default seed data"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Reset Data
                      </button>
                      <button
                        id="btn-cms-add"
                        onClick={handleOpenCreateAndInit}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-black transition-colors cursor-pointer"
                      >
                        <Plus className="h-4 w-4 text-black font-bold" />
                        Tambah Proyek
                      </button>
                    </div>
                  </div>

                  {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl py-14 text-center">
                      <AlertCircle className="h-10 w-10 text-zinc-600 mb-3" />
                      <p className="text-sm text-zinc-400 font-medium">Belum ada data proyek portofolio.</p>
                      <p className="text-xs text-zinc-600 mt-1">Silakan klik tombol 'Tambah Proyek' untuk mengisi atau pilih 'Reset Data' untuk mengimpor sampel bawaan.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 transition-all hover:bg-zinc-900/30 hover:border-zinc-800"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                              <img
                                src={project.coverUrl}
                                alt={project.title}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-zinc-100 truncate">{project.title}</h4>
                                <span className="rounded bg-zinc-800/80 text-zinc-400 px-1.5 py-0.5 text-[9px] font-mono uppercase">
                                  {project.category}
                                </span>
                                {project.featured && (
                                  <span className="rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 text-[9px] font-mono">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-md">{project.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 ml-4">
                            <button
                              id={`btn-edit-project-${project.id}`}
                              onClick={() => handleOpenEdit(project)}
                              className="rounded p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                              title="Tulis ulang / Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              id={`btn-delete-project-${project.id}`}
                              onClick={() => handleDeleteProject(project.id)}
                              className="rounded p-2 text-zinc-500 hover:bg-red-950/40 hover:text-red-400 transition-colors cursor-pointer"
                              title="Hapus permanen"
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
                <form id="project-cms-form" onSubmit={handleSaveProject} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <h3 className="font-display font-semibold text-md text-amber-400">
                      {isCreatingNew ? 'Membuat Item Portofolio Baru' : `Mengedit: ${formTitle}`}
                    </h3>
                    <button
                      type="button"
                      id="btn-cancel-form"
                      onClick={() => { setIsCreatingNew(false); setEditingProject(null); }}
                      className="text-xs font-mono text-zinc-500 hover:text-white"
                    >
                      Batal kembali
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                      <label htmlFor="form_title" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Judul Proyek</label>
                      <input
                        type="text"
                        id="form_title"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Contoh: Digital Ledger Ecosystem"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label htmlFor="form_subtitle" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Sub-judul Kreatif</label>
                      <input
                        type="text"
                        id="form_subtitle"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        placeholder="Contoh: Blockchain UX optimization and graphics visualization."
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Description (Truncated summary) */}
                  <div>
                    <label htmlFor="form_desc" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Deskripsi Singkat (Ringkasan Kartu)</label>
                    <input
                      type="text"
                      id="form_desc"
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Jelaskan dalam satu kalimat padat..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Selector */}
                    <div>
                      <label htmlFor="form_cat" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Bidang Kategori</label>
                      <select
                        id="form_cat"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="web">Web Application</option>
                        <option value="mobile">Mobile Application</option>
                        <option value="branding">Creative Branding Kit</option>
                        <option value="experimental">Eksperimental & Lab</option>
                      </select>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label htmlFor="form_timeline" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Garis Waktu (Timeline)</label>
                      <input
                        type="text"
                        id="form_timeline"
                        value={formTimeline}
                        onChange={(e) => setFormTimeline(e.target.value)}
                        placeholder="Contoh: Maret - Mei 2026"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Tags List */}
                    <div>
                      <label htmlFor="form_tags" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Tags Teknologi (Pisahkan koma)</label>
                      <input
                        type="text"
                        id="form_tags"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="Contoh: React, Web3, Framer"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* My Role */}
                    <div>
                      <label htmlFor="form_role" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Peran Saya (Role)</label>
                      <input
                        type="text"
                        id="form_role"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        placeholder="Contoh: Frontend Developer"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Client Name */}
                    <div>
                      <label htmlFor="form_client" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Klien (Opsional)</label>
                      <input
                        type="text"
                        id="form_client"
                        value={formClient}
                        onChange={(e) => setFormClient(e.target.value)}
                        placeholder="Contoh: Universitas Pamulang atau Kosongkan"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Presets and Custom Cover Image */}
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">Gambar Cover Proyek</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                      {PRESET_COVERS.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          id={`preset-cover-btn-${index}`}
                          onClick={() => setFormCoverUrl(preset.url)}
                          className={`group relative aspect-[16/10] overflow-hidden rounded-md border text-left transition-all ${
                            formCoverUrl === preset.url ? 'border-emerald-400 scale-[1.02] ring-1 ring-emerald-500' : 'border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/70 px-1 py-0.5 text-[8px] font-mono text-zinc-300 truncate tracking-tight">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    {/* Input manual URL */}
                    <input
                      type="url"
                      id="form_cover_url"
                      required
                      value={formCoverUrl}
                      onChange={(e) => setFormCoverUrl(e.target.value)}
                      placeholder="Atau tempel URL gambar kustom di sini..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Demo Website Link */}
                    <div>
                      <label htmlFor="form_web_url" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Tautan Demo Langsung (Website URL)</label>
                      <input
                        type="url"
                        id="form_web_url"
                        value={formWebsiteUrl}
                        onChange={(e) => setFormWebsiteUrl(e.target.value)}
                        placeholder="https://demoprojek.com"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* GitHub Link */}
                    <div>
                      <label htmlFor="form_git_url" className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Repositori Kode (GitHub/GitLab)</label>
                      <input
                        type="url"
                        id="form_git_url"
                        value={formGithubUrl}
                        onChange={(e) => setFormGithubUrl(e.target.value)}
                        placeholder="https://github.com/cdm/repositori"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* HTML/Markdown detailed core content */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="form_content" className="block text-[11px] font-mono uppercase text-zinc-400">Rincian Konten (Mendukung Subheading & List)</label>
                      <span className="text-[10px] text-zinc-500 font-mono">Format menggunakan: ### Judul, - poin list</span>
                    </div>
                    <textarea
                      id="form_content"
                      required
                      rows={6}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Featured Status Toggle */}
                  <div className="flex items-center gap-2 rounded-lg bg-zinc-900/40 border border-zinc-900 p-3">
                    <input
                      type="checkbox"
                      id="form_featured"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="h-4.5 w-4.5 accent-emerald-500 bg-black border-zinc-800 rounded focus:ring-0"
                    />
                    <div>
                      <label htmlFor="form_featured" className="text-xs font-semibold text-zinc-200 cursor-pointer">Sematkan sebagai Proyek Utama (Featured)</label>
                      <p className="text-[10px] text-zinc-500">Menaikkan proyek ke bagian highlight hero utama.</p>
                    </div>
                  </div>

                  {/* Save forms */}
                  <div className="flex justify-end gap-2.5 pt-2 border-t border-zinc-900">
                    <button
                      type="button"
                      id="btn-form-cancel-bottom"
                      onClick={() => { setIsCreatingNew(false); setEditingProject(null); }}
                      className="rounded-lg bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-400 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      id="btn-form-save-project"
                      className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-black transition-colors cursor-pointer"
                    >
                      Simpan Konten Proyek
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: LIVE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div id="analytics-tab-content" className="space-y-6">
              
              {/* Header metrics card */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Eye className="h-3 w-3 text-emerald-400" /> Total Kunjungan Sesi
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold font-mono text-emerald-400">{totalVisits + 1}</span>
                    <span className="text-[10px] text-zinc-500 block">Page views</span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-emerald-400" /> Detil Proyek Dibuka
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold font-mono text-emerald-400">{projectDetailsTotalViews}</span>
                    <span className="text-[10px] text-zinc-500 block">Engagement hits</span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Inbox className="h-3 w-3 text-emerald-400" /> Formulir Sukses
                  </span>
                  <div className="mt-2.5">
                    <span className="text-3xl font-bold font-mono text-emerald-400">{totalFormSubmits}</span>
                    <span className="text-[10px] text-zinc-500 block">Pesan Diterima</span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3 text-emerald-400" /> Durasi Sesi Aktif
                  </span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-bold font-mono text-zinc-200 tracking-tight">{formatSecs(activeSeconds)}</span>
                    <span className="text-[10px] text-zinc-500 block">Ticking real-time</span>
                  </div>
                </div>
              </div>

              {/* Engagement Bar charts */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/15 p-5">
                <h4 className="font-display font-semibold text-sm text-zinc-200 mb-4 flex items-center gap-2">
                  <Sparkle className="h-4 w-4 text-emerald-400" /> Pengunjung Per-Proyek (Klik & Detil Dibuka)
                </h4>
                <div className="space-y-3.5">
                  {projectEngagementList.map((p, index) => {
                    // Normalize bar widths
                    const maxCount = Math.max(...projectEngagementList.map(item => item.views), 1);
                    const percent = Math.round((p.views / maxCount) * 100);
                    
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-zinc-300 truncate max-w-sm">{p.title}</span>
                          <span className="text-emerald-400 font-semibold">{p.views} interaksi</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-zinc-900/80 overflow-hidden border border-zinc-900/30">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400/80"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feed: Real Time Activity Log stream */}
              <div className="rounded-xl border border-zinc-900 bg-zinc-900/15 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-display font-semibold text-sm text-zinc-200 flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Real-time Activity Tracker Feed
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Aktivitas Pengunjung</span>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-2.5 rounded-lg bg-black/40 border border-zinc-900 p-3.5 font-mono text-[11px] leading-relaxed text-zinc-400">
                  {events.length === 0 ? (
                    <p className="text-center text-zinc-600 py-4">Aktivitas pengunjung akan muncul di sini secara otomatis.</p>
                  ) : (
                    events.map((evt) => {
                      let typeLabel = '';
                      let typeColor = 'text-zinc-500';
                      
                      switch(evt.type) {
                        case 'visit':
                          typeLabel = '[VISIT/START]';
                          typeColor = 'text-blue-400';
                          break;
                        case 'project_view':
                          typeLabel = '[ENGAGE/PROJECT]';
                          typeColor = 'text-amber-400';
                          break;
                        case 'contact_open':
                          typeLabel = '[CONTACT/FORM_OPEN]';
                          typeColor = 'text-indigo-400';
                          break;
                        case 'contact_submit':
                          typeLabel = '[CONTACT/SUCCESS]';
                          typeColor = 'text-emerald-400 font-semibold';
                          break;
                        case 'external_click':
                          typeLabel = '[LINK/REDIRECT]';
                          typeColor = 'text-fuchsia-400';
                          break;
                        default:
                          typeLabel = '[TELEMETRY]';
                      }

                      return (
                        <div key={evt.id} className="flex items-start gap-2 border-b border-zinc-900/40 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-[10px] text-zinc-500 flex-shrink-0">{evt.timestamp}</span>
                          <span className={`${typeColor} uppercase flex-shrink-0`}>{typeLabel}</span>
                          <span className="text-zinc-300">{evt.detail}</span>
                          {evt.device && <span className="text-[10px] text-emerald-500/60 ml-auto flex-shrink-0">({evt.device})</span>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CONTACT FORM INBOX */}
          {activeTab === 'inbox' && (
            <div id="inbox-tab-content">
              <div className="mb-4">
                <h3 className="text-md font-display font-semibold text-white">
                  Semua Pesan Masuk
                </h3>
                <p className="text-xs text-zinc-500">Menyimpan pertanyaan dari formulir kontak portofolio.</p>
              </div>

              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-xl py-14 text-center">
                  <Inbox className="h-10 w-10 text-zinc-650 mb-3" />
                  <p className="text-sm text-zinc-400 font-medium">Kotak Masuk Kosong.</p>
                  <p className="text-xs text-zinc-650 mt-1">Belum ada pengunjung yang mengirimkan pesan kontak.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-xl border p-4 transition-all ${
                        msg.status === 'unread' 
                          ? 'border-emerald-500 bg-emerald-950/5/10' 
                          : 'border-zinc-900 bg-zinc-900/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-zinc-200">{msg.name}</span>
                            <span className="text-xs text-emerald-400 font-mono">({msg.email})</span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-amber-400 font-sans block mt-0.5">Subjek: {msg.subject}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <span className="text-[10px] font-mono text-zinc-600 mr-1.5">{msg.timestamp}</span>
                          <button
                            id={`btn-read-toggle-${msg.id}`}
                            onClick={() => handleToggleMessageStatus(msg.id)}
                            className={`rounded px-2.5 py-1 text-[10px] font-mono transition-colors border cursor-pointer ${
                              msg.status === 'unread'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`}
                          >
                            {msg.status === 'unread' ? 'Tandai Dibaca' : 'Belum Dibaca'}
                          </button>
                          <button
                            id={`btn-delete-msg-${msg.id}`}
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="rounded p-1.5 border border-zinc-800 text-zinc-400 hover:border-red-900 hover:bg-red-950/30 hover:text-red-400 transition-colors cursor-pointer"
                            title="Hapus Pesan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Content text block */}
                      <div className="mt-3 border-t border-zinc-900 bg-zinc-950/60 rounded-lg p-3 text-xs leading-relaxed text-zinc-300 font-sans">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Console footer bar */}
        <div className="border-t border-zinc-900 bg-zinc-950 px-6 py-4.5 text-center flex items-center justify-between">
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Status Sistem: Online
          </p>
          <p className="text-[10px] font-mono text-zinc-550">
            Portfolio Dashboard • Muhammad Fikri Fahreza
          </p>
        </div>
      </motion.div>
    </div>
  );
}
