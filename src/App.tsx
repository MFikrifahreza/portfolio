import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  loadProjects, saveProjects, loadMessages, saveAnalyticsEvent, loadAnalyticsEvents, INITIAL_PROJECTS
} from './data';
import { Project, ContactMessage, AnalyticsEvent } from './types';

// Importing Custom Sub-components
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';

// Importing Lucide Icons
import { 
  Sparkles, Layers, MessageSquare, Terminal, ChevronRight, ArrowRight,
  Database, Eye, Laptop, Smartphone, Globe, Github, Info, AlertTriangle, Menu, X, ArrowUpRight
} from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);
  
  // Custom interactive layout states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [activeSeconds, setActiveSeconds] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize and seed states
  useEffect(() => {
    const loadedProjects = loadProjects();
    const loadedMessages = loadMessages();
    const loadedEvents = loadAnalyticsEvents();
    
    setProjects(loadedProjects);
    setMessages(loadedMessages);
    setAnalyticsEvents(loadedEvents);

    // Initial event recorder
    const deviceType = window.innerWidth >= 1024 ? 'Desktop' : window.innerWidth >= 768 ? 'Tablet' : 'Mobile';
    const launchEvent: AnalyticsEvent = {
      id: `evt-launch-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      type: 'visit',
      detail: `Memulai kunjungan sesi baru portofolio`,
      device: deviceType
    };
    saveAnalyticsEvent(launchEvent);
    setAnalyticsEvents(prev => [launchEvent, ...prev]);
  }, []);

  // Live session timer ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger dynamic action logger utility
  const recordEvent = (type: AnalyticsEvent['type'], detail: string) => {
    const deviceType = window.innerWidth >= 1024 ? 'Desktop' : window.innerWidth >= 768 ? 'Tablet' : 'Mobile';
    const newEvt: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      type,
      detail,
      device: deviceType
    };
    saveAnalyticsEvent(newEvt);
    setAnalyticsEvents(prev => [newEvt, ...prev]);
  };

  const handleOpenProjectDetail = (project: Project) => {
    // Increment project view counter on click
    const updated = projects.map(p => {
      if (p.id === project.id) {
        return { ...p, views: p.views + 1 };
      }
      return p;
    });
    setProjects(updated);
    saveProjects(updated);

    setSelectedProject({ ...project, views: project.views + 1 });
    recordEvent('project_view', `Melihat detail proyek: "${project.title}"`);
  };

  const handleContactSuccess = () => {
    // Record inquiry submission event logs
    recordEvent('contact_submit', 'Mengirimkan formulir kontak baru');
    // Refresh inbox states
    setMessages(loadMessages());
  };

  const handleUpdateProjectsFromCMS = (newPrjs: Project[]) => {
    setProjects(newPrjs);
    saveProjects(newPrjs);
    recordEvent('visit', 'Memperbarui data portofolio');
  };

  const handleUpdateMessagesFromCMS = (newMsgs: ContactMessage[]) => {
    // Persist new messages state
    localStorage.setItem('mff_portfolio_messages', JSON.stringify(newMsgs));
    setMessages(newMsgs);
  };

  const handleResetProjectsToDefault = () => {
    localStorage.setItem('cdm_portfolio_projects', JSON.stringify(INITIAL_PROJECTS));
    setProjects(INITIAL_PROJECTS);
    recordEvent('visit', 'Mengembalikan data portofolio ke kondisi awal');
  };

  const filteredProjects = categoryFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === categoryFilter);

  // Scroll smoothly to any specific DOM segment on clicks
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans antialiased relative selection:bg-emerald-500 selection:text-black">
      
      {/* Background Atmosphere glow */}
      <div className="absolute top-0 right-0 h-[450px] w-[450px] rounded-full bg-emerald-500/5 glow-blur -z-10" />
      <div className="absolute top-1/3 left-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 glow-blur -z-10" />
      <div className="absolute bottom-20 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 glow-blur -z-10" />

      {/* HEADER SECTION (CDM bespoke design) */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/80 backdrop-blur-md border-b border-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          
          {/* Typographic "CDM" Logo brand */}
          <div 
            onClick={() => scrollToSection('hero')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 border border-zinc-700/60 ring-1 ring-black shadow-inner">
              <span className="font-display font-bold text-amber-400 text-sm tracking-widest group-hover:text-emerald-400 transition-colors">
                MFF
              </span>
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-tight text-white block">
                MFIzaaa
              </span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block leading-none">
                Student • Developer • Learner
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-zinc-400">
            <button 
              id="nav-to-portfolio" 
              onClick={() => { scrollToSection('portfolio'); recordEvent('visit', 'Navigasi ke Karya Portofolio'); }} 
              className="hover:text-amber-300 transition-colors"
            >
              KARYA
            </button>
            <button 
              id="nav-to-about" 
              onClick={() => { scrollToSection('about'); recordEvent('visit', 'Navigasi ke Tentang Saya'); }} 
              className="hover:text-amber-300 transition-colors"
            >
              TENTANG
            </button>
            <button 
              id="nav-to-contact" 
              onClick={() => { scrollToSection('contact'); recordEvent('visit', 'Navigasi ke Formulir Hubungi'); }} 
              className="hover:text-amber-300 transition-colors animate-pulse"
            >
              KONTAK
            </button>
          </nav>

          {/* Action Badge & Mobile controls */}
          <div className="flex items-center gap-3">
            <button
              id="header-btn-cms-open"
              onClick={() => { setShowAdminPanel(true); recordEvent('visit', 'Membuka Panel Admin'); }}
              className="hidden lg:flex items-center gap-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500 hover:bg-zinc-900 px-3.5 py-1.5 text-[11px] font-mono font-medium text-emerald-400 tracking-tight transition-all cursor-pointer shadow-sm shadow-black"
            >
              <Database className="h-3.5 w-3.5" />
              Panel Admin
            </button>

            {/* Mobile Hamburger Burger menu */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE HUD MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-b border-zinc-900 bg-[#090a0f] px-6 py-5 space-y-4"
          >
            <div className="flex flex-col gap-3.5 font-mono text-xs tracking-wider uppercase">
              <button
                id="link-m-portfolio"
                onClick={() => scrollToSection('portfolio')}
                className="text-left py-2 border-b border-zinc-950 text-zinc-300 hover:text-white"
              >
                Karya Portofolio
              </button>
              <button
                id="link-m-about"
                onClick={() => scrollToSection('about')}
                className="text-left py-2 border-b border-zinc-950 text-zinc-300 hover:text-white"
              >
                Tentang Saya
              </button>
              <button
                id="link-m-contact"
                onClick={() => scrollToSection('contact')}
                className="text-left py-2 border-b border-zinc-950 text-zinc-300 hover:text-white"
              >
                Formulir Kontak
              </button>
              <button
                id="link-m-admin"
                onClick={() => { setMobileMenuOpen(false); setShowAdminPanel(true); }}
                className="flex items-center gap-2 py-2.5 text-emerald-400 font-semibold"
              >
                <Database className="h-4 w-4" />
                Masuk Admin Panel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE WRAPPER BODY CONTENT */}
      <main className="flex-1">
        
        {/* HERO INSTANT GREETINGS */}
        <section id="hero" className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-32 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono text-emerald-400"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span>Mahasiswa Universitas Pamulang</span>
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight md:leading-none">
  Muhammad Fiqri Fahreza
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 block">
    Mahasiswa Sistem Informasi
  </span>
</h1>

              <p className="max-w-xl text-zinc-400 text-sm sm:text-md leading-relaxed font-sans">
                Selamat datang di platform portofolio Muhammad Fiqri Fahreza.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-3">
                <button
                  id="hero-scroll-btn-portfolio"
                  onClick={() => scrollToSection('portfolio')}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3.5 text-xs font-bold text-black tracking-widest uppercase flex items-center gap-2 transition-all cursor-pointer"
                >
                  Ekplorasi Karya
                  <ChevronRight className="h-4 w-4 text-black" />
                </button>
                <button
                  id="hero-scroll-btn-contact"
                  onClick={() => scrollToSection('contact')}
                  className="rounded-xl bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 px-6 py-3.5 text-xs font-mono text-zinc-300 tracking-wider uppercase transition-all cursor-pointer"
                >
                  Hubungi Saya
                </button>
              </div>
            </div>

            {/* Ambient visual badge on right */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900/10 p-4.5 shadow-2xl flex flex-col justify-between overflow-hidden group">
                {/* Visual grid background lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">PROFIL MAHASISWA</span>
                </div>

                {/* Cyber badge content stats */}
                <div className="my-auto py-8 text-center z-10">
                  <span className="text-[11px] font-mono text-amber-400 block tracking-widest uppercase">SISTEM INFORMASI</span>
                  <span className="text-6xl font-extrabold font-display text-white tracking-widest mt-1 block">
                    MFF
                  </span>
                  <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-widest mt-1.5 block">
                    Universitas Pamulang
                  </span>
                </div>
                <span className="text-zinc-300 font-semibold">Mahasiswa Aktif</span>
              </div>
            </div>

          </div>
        </section>

        {/* WORKS PORTFOLIO PORTION */}
        <section id="portfolio" className="border-t border-zinc-950 bg-zinc-950/20 py-20">
          <div className="mx-auto max-w-7xl px-6">
            
            {/* Headers titles */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block">Portfolio</span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-1 md:text-4xl">
                  Proyek dan Hasil Pembelajaran
                </h2>
              </div>
              
              {/* Category Filter selectors */}
              <div className="flex flex-wrap items-center gap-1 bg-zinc-900/40 border border-zinc-900 p-1 rounded-xl">
                {['all', 'web', 'mobile', 'branding', 'experimental'].map((cat) => (
                  <button
                    key={cat}
                    id={`filter-btn-${cat}`}
                    onClick={() => { setCategoryFilter(cat); recordEvent('visit', `Filter kategori proyek: "${cat}"`); }}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      categoryFilter === cat 
                        ? 'bg-emerald-500 text-black font-semibold' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic filtered grid */}
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-2xl py-20 text-center bg-zinc-950/20">
                <AlertTriangle className="h-10 w-10 text-zinc-700 mb-3" />
                <p className="text-sm text-zinc-400 font-medium">Tidak ada proyek dalam kategori {categoryFilter}.</p>
                <p className="text-xs text-zinc-655 mt-1">Anda dapat menambahkannya melalui Panel Admin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      onOpen={handleOpenProjectDetail}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

          </div>
        </section>

        {/* ABOUT / CREATIVE PHILOSOPHY */}
        <section id="about" className="py-20 border-t border-zinc-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl border border-zinc-900 bg-linear-to-b from-zinc-950/80 to-zinc-950/20 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 glow-blur" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center.">
                
                <div className="md:col-span-5 space-y-4">
                  <span className="text-[11px] font-mono text-amber-500 uppercase tracking-widest block">TENTANG SAYA</span>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white leading-tight md:text-3xl">
                    Mahasiswa Sistem Informasi yang Bersemangat dalam Teknologi dan Pengembangan Web
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                    Saya adalah mahasiswa Sistem Informasi Universitas Pamulang yang memiliki minat dalam pengembangan website, desain antarmuka, dan teknologi informasi. Saya terus belajar dan mengembangkan kemampuan melalui berbagai proyek akademik maupun proyek pribadi untuk meningkatkan keterampilan di bidang teknologi.
                  </p>
                  
                  {/* Small stat rows */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-zinc-500 block">Mahasiswa Sistem Informasi</span>
                      <span className="text-2xl font-bold font-mono text-emerald-400">Universitas Pamulang</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-zinc-500 block">Proyek Pembelajaran</span>
                      <span className="text-2xl font-bold font-mono text-amber-400">5</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4.5 bg-zinc-950/40 rounded-2xl border border-zinc-900/60 p-6 font-sans">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
                   KEAHLIAN DAN FOKUS PEMBELAJARAN
                  </h4>
                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        01
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">Pengembangan Web</h5>
                        <p className="text-xs text-zinc-400 mt-0.5">Membangun website yang responsif dan interaktif dengan memanfaatkan teknologi web modern untuk mendukung kebutuhan pengguna.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        02
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">Database & Sistem Informasi</h5>
                        <p className="text-xs text-zinc-400 mt-0.5">Mempelajari pengelolaan data, perancangan basis data, dan implementasi sistem informasi yang efektif dan terstruktur.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono shrink-0">
                        03
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">UI/UX Design</h5>
                        <p className="text-xs text-zinc-400 mt-0.5">Merancang antarmuka yang menarik dan mudah digunakan guna meningkatkan pengalaman pengguna dalam menggunakan aplikasi maupun website.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* WORKSTATION CONTACT & FORM AREA */}
        <section id="contact" className="py-20 border-t border-zinc-950 bg-zinc-950/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              
              {/* Sidebar description contact */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest block">Hubungi Kontak</span>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-1">
                    Mari Terhubung dan Berdiskusi
                  </h2>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                  Terima kasih telah mengunjungi portofolio saya. Apabila Anda ingin bertanya, memberikan masukan, atau berdiskusi mengenai proyek dan teknologi, silakan kirimkan pesan melalui formulir kontak yang tersedia.
                </p>

                {/* Micro info boxes */}
                <div className="space-y-3 pt-4 border-t border-zinc-900 text-xs font-mono">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-emerald-400 text-xs">[KONTAK]</span>
                    <span>fikrifahreza597@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-emerald-400 text-xs">[WAKTU]</span>
                    <span>Senin - Jumat | 09.00 - 18.00 WIB</span>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-zinc-550 italic text-[10px]">Aktif dan siap dihubungi.</span>
                  </div>
                </div>
              </div>

              {/* Core interactive form container */}
              <div className="md:col-span-7">
                <ContactForm onSuccess={handleContactSuccess} />
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <footer className="border-t border-zinc-900/60 bg-zinc-950 py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-display font-bold text-[10px] text-amber-400">
              MF
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              © Muhammad Fiqri Fahreza.
            </p>
          </div>

          <div className="flex items-center gap-4.5 text-xs text-zinc-550 font-mono">
            <button
              id="footer-btn-cms-open"
              onClick={() => { setShowAdminPanel(true); recordEvent('visit', 'Membuka Admin panel dari footer'); }}
              className="hover:text-emerald-400 border border-dashed border-zinc-850 hover:border-emerald-500/40 rounded px-2.5 py-1 transition-all cursor-pointer flex items-center gap-1.5 bg-zinc-950"
            >
              <Database className="h-3 w-3" />
              Kelola Portofolio
            </button>
            <span className="h-3 w-px bg-zinc-900" />
            <button 
              id="footer-scroll-to-top" 
              onClick={() => scrollToSection('hero')} 
              className="hover:text-amber-400 transition-colors"
            >
              KEMBALI KE ATAS ↑
            </button>
          </div>

        </div>
      </footer>

      {/* MODAL DETAL PROYEK ANIMATED PANEL DRAWER */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* MODAL PANEL ADMIN */}
      <AnimatePresence>
        {showAdminPanel && (
          <AdminPanel
            projects={projects}
            messages={messages}
            events={analyticsEvents}
            activeSeconds={activeSeconds}
            onUpdateProjects={handleUpdateProjectsFromCMS}
            onUpdateMessages={handleUpdateMessagesFromCMS}
            onResetProjects={handleResetProjectsToDefault}
            onClose={() => setShowAdminPanel(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
