import { AnimatePresence, motion } from "motion/react";

import { useEffect, useState } from "react";

import {

    INITIAL_PROJECTS,

    loadAnalyticsEvents,

    loadMessages,

    loadProjects,

    saveAnalyticsEvent,

    saveMessages,

    saveProjects,

} from "./data";

import { AnalyticsEvent, ContactMessage, Project } from "./types";

// Importing Custom Sub-components

import AdminPanel from "./components/AdminPanel";

import ContactForm from "./components/ContactForm";

import ProjectCard from "./components/ProjectCard";

import ProjectDetail from "./components/ProjectDetail";

// Importing Lucide Icons

import {

    AlertTriangle,

    ChevronRight,

    Database,

    Menu,

    Sparkles,

    X,

} from "lucide-react";

import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db, provider } from "./firebase";

export default function App() {

  const [projects, setProjects] = useState<Project[]>([]);

  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  // Custom interactive layout states

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [activeSeconds, setActiveSeconds] = useState(0);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [authChecking, setAuthChecking] = useState(true);

  // Initialize and seed states

  useEffect(() => {

  const init = async () => {

    const loadedProjects = await loadProjects();

    const loadedMessages = await loadMessages();

    const loadedEvents = await loadAnalyticsEvents();

    setProjects(loadedProjects);

    setMessages(loadedMessages);

    setAnalyticsEvents(loadedEvents);

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

  };

  init();

}, []);

  // Cek status login Firebase secara otomatis setiap kali halaman dibuka/refresh

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser && firebaseUser.email) {

        try {

          const userRef = doc(db, "users", firebaseUser.uid);

          const snap = await getDoc(userRef);

          const userData = snap.exists() ? snap.data() : null;

          if (userData && userData.role === "admin") {

            setUser(firebaseUser);

            setIsAdmin(true);

          } else {

            setUser(null);

            setIsAdmin(false);

          }

        } catch (err) {

          console.error("Gagal memverifikasi status admin:", err);

          setUser(null);

          setIsAdmin(false);

        }

      } else {

        setUser(null);

        setIsAdmin(false);

      }

      setAuthChecking(false);

    });

    return () => unsubscribe();

  }, []);

  // Live session timer ticks

  useEffect(() => {

    const interval = setInterval(() => {

      setActiveSeconds(prev => prev + 1);

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // Trigger dynamic action logger utility

  const recordEvent = (type: AnalyticsEvent["type"], detail: string) => {

    const deviceType =

      window.innerWidth >= 1024

        ? "Desktop"

        : window.innerWidth >= 768

          ? "Tablet"

          : "Mobile";

    const newEvt: AnalyticsEvent = {

      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

      timestamp: new Date().toLocaleTimeString("id-ID"),

      type,

      detail,

      device: deviceType,

    };

    saveAnalyticsEvent(newEvt);

    setAnalyticsEvents((prev) => [newEvt, ...prev]);

  };

  const handleOpenProjectDetail = (project: Project) => {

    // Increment project view counter on click

    const updated = projects.map((p) => {

      if (p.id === project.id) {

        return { ...p, views: p.views + 1 };

      }

      return p;

    });

    setProjects(updated);

    saveProjects(updated);

    setSelectedProject({ ...project, views: project.views + 1 });

    recordEvent("project_view", `Melihat detail proyek: "${project.title}"`);

  };

  const handleContactSuccess = async () => {

  recordEvent("contact_submit", "Mengirimkan formulir kontak baru");

  setMessages(await loadMessages());

};

  const handleUpdateProjectsFromCMS = (newPrjs: Project[]) => {

    setProjects(newPrjs);

    saveProjects(newPrjs);

    recordEvent("visit", "Memperbarui data portofolio");

  };

  const handleUpdateMessagesFromCMS = (newMsgs: ContactMessage[]) => {

  setMessages(newMsgs);

  saveMessages(newMsgs);

};

  const handleResetProjectsToDefault = () => {

    localStorage.setItem(

      "cdm_portfolio_projects",

      JSON.stringify(INITIAL_PROJECTS),

    );

    setProjects(INITIAL_PROJECTS);

    recordEvent("visit", "Mengembalikan data portofolio ke kondisi awal");

  };


const categoryOptions = [
  { value: "all", label: "Semua" },
  { value: "web", label: "Web App" },
  { value: "mobile", label: "Mobile App" },
  { value: "branding", label: "Branding" },
  { value: "experimental", label: "Eksperimental" },
  { value: "game", label: "Game Development" },
];


  const activeCategoryLabel =
    categoryOptions.find((category) => category.value === categoryFilter)?.label ??
    categoryFilter;

  const filteredProjects =
    categoryFilter === "all"
      ? projects
      : projects.filter((p) => p.category === categoryFilter);

  // Scroll smoothly to any specific DOM segment on clicks

  const scrollToSection = (id: string) => {

    const element = document.getElementById(id);

    if (element) {

      element.scrollIntoView({ behavior: "smooth" });

    }

    setMobileMenuOpen(false);

  };

  const ADMIN_EMAILS = ["fikrieza69@gmail.com"];

  const handleLogin = async () => {

    try {

      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      if (!firebaseUser.email) {

        alert("Email tidak ditemukan");

        await signOut(auth);

        return;

      }

      const userRef = doc(db, "users", firebaseUser.uid);

      const snap = await getDoc(userRef);

      const isAdminEmail = ADMIN_EMAILS.includes(firebaseUser.email);

      if (!snap.exists()) {

        await setDoc(userRef, {

          email: firebaseUser.email,

          role: isAdminEmail ? "admin" : "user",

          createdAt: new Date().toISOString(),

        });

      }

      const userData = (await getDoc(userRef)).data();

      if (!userData || userData.role !== "admin") {

        alert("Akses ditolak (bukan admin)");

        await signOut(auth);

        return;

      }

      setShowAdminPanel(true);

    } catch (err) {

      console.error("Login error:", err);

    }

  };

  const handleLogout = async () => {

    await signOut(auth);

    setUser(null);

    setIsAdmin(false);

    setShowAdminPanel(false);

    recordEvent("visit", "Admin logout");

  };

  return (

    <div className="min-h-screen bg-[var(--bg)] text-zinc-100 flex flex-col antialiased relative selection:bg-[var(--aksen)] selection:text-white">

      {/* HEADER SECTION */}

      <header className="sticky top-0 z-40 bg-[var(--bg)] timbul">

        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">

          {/* Logo Brand */}

          <div

            onClick={() => scrollToSection("hero")}

            className="flex items-center gap-2.5 cursor-pointer group"

          >

            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[var(--bg)] timbul">

              <span className="font-display font-bold text-[var(--aksen)] text-sm tracking-widest group-hover:text-white transition-colors duration-300">

                MFF

              </span>

            </div>

            <div>

              <span className="font-display text-base font-bold tracking-tight text-white block">

                MFIzaaa

              </span>

              <span className="text-[9px] text-zinc-400 tracking-widest uppercase block leading-none">

                Student • Developer • Learner

              </span>

            </div>

          </div>

          {/* Desktop Nav Actions */}

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-zinc-400">

            <button

              id="nav-to-portfolio"

              onClick={() => {

                scrollToSection("portfolio");

                recordEvent("visit", "Navigasi ke Karya Portofolio");

              }}

              className="hover:text-[var(--aksen)] transition-colors duration-300"

            >

              Karya

            </button>

            <button

              id="nav-to-about"

              onClick={() => {

                scrollToSection("about");

                recordEvent("visit", "Navigasi ke Tentang Saya");

              }}

              className="hover:text-[var(--aksen)] transition-colors duration-300"

            >

              Tentang

            </button>

            <button

              id="nav-to-contact"

              onClick={() => {

                scrollToSection("contact");

                recordEvent("visit", "Navigasi ke Formulir Hubungi");

              }}

              className="hover:text-[var(--aksen)] transition-colors duration-300"

            >

              Kontak

            </button>

          </nav>

          {/* Action Badge & Mobile controls */}

          <div className="flex items-center gap-3">

            {user && (

              <button

                onClick={handleLogout}

                className="tombol text-xs px-3 py-1.5 rounded-xl text-red-400 bg-[var(--bg)] timbul transition-all duration-300"

              >

                Logout

              </button>

            )}

            <button

              id="header-btn-cms-open"

              onClick={() => {

                if (user && isAdmin) {

                  setShowAdminPanel(true);

                } else {

                  handleLogin();

                }

              }}

              className="tombol hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg)] timbul text-xs font-semibold text-[var(--aksen)] transition-all duration-300"

            >

              <Database className="h-3.5 w-3.5" />

              Admin

            </button>

            {/* Mobile Menu Toggle */}

            <button

              id="mobile-nav-toggle"

              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}

              className="tombol md:hidden rounded-xl p-2 bg-[var(--bg)] timbul text-zinc-400 hover:text-white transition-all duration-300"

              aria-label="Toggle Menu"

            >

              {mobileMenuOpen ? (

                <X className="h-5 w-5" />

              ) : (

                <Menu className="h-5 w-5" />

              )}

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

            animate={{ opacity: 1, height: "auto" }}

            exit={{ opacity: 0, height: 0 }}

            transition={{ duration: 0.3 }}

            className="md:hidden bg-[var(--bg)] px-6 py-5 space-y-4"

          >

            <div className="flex flex-col gap-3.5 text-xs tracking-wider uppercase">

              <button

                id="link-m-portfolio"

                onClick={() => scrollToSection("portfolio")}

                className="text-left py-2 border-b border-white/10 text-zinc-300 hover:text-white transition-colors duration-300"

              >

                Karya Portofolio

              </button>

              <button

                id="link-m-about"

                onClick={() => scrollToSection("about")}

                className="text-left py-2 border-b border-white/10 text-zinc-300 hover:text-white transition-colors duration-300"

              >

                Tentang Saya

              </button>

              <button

                id="link-m-contact"

                onClick={() => scrollToSection("contact")}

                className="text-left py-2 border-b border-white/10 text-zinc-300 hover:text-white transition-colors duration-300"

              >

                Formulir Kontak

              </button>

              <button

                id="link-m-admin"

                onClick={() => {

                  setMobileMenuOpen(false);

                  if (user && isAdmin) {

                    setShowAdminPanel(true);

                  } else {

                    handleLogin();

                  }

                }}

                className="flex items-center gap-2 py-2.5 text-[var(--aksen)] font-semibold hover:text-white transition-colors duration-300"

              >

                <Database className="h-4 w-4" />

                Admin Panel

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

      {/* CORE WRAPPER BODY CONTENT */}

      <main className="flex-1">

        {/* HERO SECTION */}

        <section

          id="hero"

          className="mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-32 text-center md:text-left"

        >

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

            <div className="md:col-span-7 space-y-6">

              <motion.div

                initial={{ opacity: 0, x: -20 }}

                animate={{ opacity: 1, x: 0 }}

                transition={{ duration: 0.8 }}

                className="inline-flex items-center gap-2 rounded-full bg-[var(--bg)] cekung px-3.5 py-1 text-xs text-[var(--aksen)]"

              >

                <Sparkles className="h-3.5 w-3.5 text-[var(--aksen)]" />

                <span>Mahasiswa Universitas Pamulang</span>

              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight md:leading-none">

                Muhammad Fiqri Fahreza

                <span className="text-[var(--aksen)] block">

                  Sistem Informasi

                </span>

              </h1>

              <p className="max-w-xl text-zinc-400 text-sm sm:text-md leading-relaxed">

                Mahasiswa Sistem Informasi yang bersemangat dalam pengembangan

                web dan teknologi. Selamat datang di portofolio saya.

              </p>

              {/* Action buttons */}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-3">

                <button

                  id="hero-scroll-btn-portfolio"

                  onClick={() => scrollToSection("portfolio")}

                  className="tombol rounded-xl bg-[var(--bg)] timbul text-[var(--aksen)] px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all duration-300 cursor-pointer"

                >

                  Eksplorasi Karya

                  <ChevronRight className="h-4 w-4" />

                </button>

                <button

                  id="hero-scroll-btn-contact"

                  onClick={() => scrollToSection("contact")}

                  className="rounded-xl bg-[var(--bg)] cekung px-6 py-3 text-xs text-zinc-300 tracking-wider uppercase transition-all duration-300 cursor-pointer hover:text-white"

                >

                  Hubungi Saya

                </button>

              </div>

            </div>

            {/* Profile Card */}

            <div className="md:col-span-5 flex justify-center">

              <div className="relative aspect-square w-full max-w-sm rounded-3xl bg-[var(--bg)] timbul p-6 flex flex-col justify-between overflow-hidden group">

                {/* Background Image */}

                <img

                  src="/profil.jpeg"

                  alt="Foto Profil Muhammad Fiqri Fahreza"

                  className="absolute inset-0 w-full h-full object-cover z-0"

                />

                {/* Overlay gelap agar teks tetap terbaca */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[1]" />

                <div className="flex items-center justify-between z-10">

                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">

                    Profil

                  </span>

                </div>

                <span className="text-zinc-300 text-sm font-semibold z-10">

                  Mahasiswa Aktif

                </span>

              </div>

            </div>

          </div>

        </section>

        {/* WORKS PORTFOLIO SECTION */}

        <section id="portfolio" className="py-20">

          <div className="mx-auto max-w-7xl px-6">

            {/* Section Header */}

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">

              <div>

                <span className="text-[11px] text-[var(--aksen)] uppercase tracking-widest block">

                  Portfolio

                </span>

                <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-1 md:text-4xl">

                  Proyek dan Pembelajaran

                </h2>

              </div>

              {/* Category Filter */}

              <div
                className="flex flex-wrap items-center gap-2 bg-[var(--bg)] cekung p-2 rounded-2xl"
                aria-label="Filter kategori proyek"
              >
                {categoryOptions.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    id={`filter-btn-${category.value}`}
                    aria-pressed={categoryFilter === category.value}
                    onClick={() => {
                      setCategoryFilter(category.value);
                      recordEvent(
                        "visit",
                        `Filter kategori proyek: "${category.value}"`,
                      );
                    }}
                    className={`rounded-xl px-3 py-1.5 text-[10px] uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      categoryFilter === category.value
                        ? "bg-[var(--bg)] timbul text-[var(--aksen)] font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}

              </div>

            </div>

            {/* Projects Grid */}

            {filteredProjects.length === 0 ? (

              <div className="flex flex-col items-center justify-center rounded-3xl py-20 text-center bg-[var(--bg)] cekung">

                <AlertTriangle className="h-10 w-10 text-zinc-600 mb-3" />

                <p className="text-sm text-zinc-400 font-medium">

                  Tidak ada proyek dalam kategori {activeCategoryLabel}.

                </p>

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

        {/* ABOUT SECTION */}

        <section id="about" className="py-20">

          <div className="mx-auto max-w-7xl px-6">

            <div className="rounded-3xl bg-[var(--bg)] timbul p-8 md:p-12 relative overflow-hidden">

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">

                <div className="md:col-span-5 space-y-4">

                  <span className="text-[11px] text-[var(--aksen)] uppercase tracking-widest block">

                    Tentang Saya

                  </span>

                  <h3 className="font-display text-3xl font-bold tracking-tight text-white leading-tight">

                    Mahasiswa yang Bersemangat Belajar Teknologi

                  </h3>

                  <p className="text-zinc-300 text-sm leading-relaxed">

                    Saya adalah mahasiswa Sistem Informasi Universitas Pamulang

                    dengan minat dalam pengembangan website, desain antarmuka,

                    dan teknologi informasi. Saya terus belajar dan

                    mengembangkan kemampuan melalui berbagai proyek untuk

                    meningkatkan keterampilan.

                  </p>

                  {/* Stats */}

                  <div className="grid grid-cols-2 gap-4 pt-4">

                    <div>

                      <span className="text-[10px] uppercase text-zinc-400 block">

                        Semester

                      </span>

                      <span className="text-2xl font-bold text-[var(--aksen)]">

                        5

                      </span>

                    </div>

                    <div>

                      <span className="text-[10px] uppercase text-zinc-400 block">

                        Proyek

                      </span>

                      <span className="text-2xl font-bold text-[var(--aksen)]">

                        {projects.length}

                      </span>

                    </div>

                  </div>

                </div>

                <div className="md:col-span-7 space-y-4 bg-[var(--bg)] cekung rounded-2xl p-6">

                  <h4 className="text-xs uppercase tracking-widest text-zinc-300">

                    Keahlian & Fokus

                  </h4>

                  <div className="space-y-3.5">

                    <div className="flex items-start gap-3">

                      <div className="h-6 w-6 rounded-full bg-[var(--bg)] timbul text-[var(--aksen)] flex items-center justify-center text-[10px] shrink-0">

                        01

                      </div>

                      <div>

                        <h5 className="text-xs font-bold text-white">

                          Pengembangan Web

                        </h5>

                        <p className="text-xs text-zinc-400 mt-1">

                          Membangun website responsif dan interaktif dengan

                          teknologi web modern.

                        </p>

                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="h-6 w-6 rounded-full bg-[var(--bg)] timbul text-[var(--aksen)] flex items-center justify-center text-[10px] shrink-0">

                        02

                      </div>

                      <div>

                        <h5 className="text-xs font-bold text-white">

                          Database & Sistem

                        </h5>

                        <p className="text-xs text-zinc-400 mt-1">

                          Pengelolaan data dan perancangan sistem informasi yang

                          terstruktur.

                        </p>

                      </div>

                    </div>

                    <div className="flex items-start gap-3">

                      <div className="h-6 w-6 rounded-full bg-[var(--bg)] timbul text-[var(--aksen)] flex items-center justify-center text-[10px] shrink-0">

                        03

                      </div>

                      <div>

                        <h5 className="text-xs font-bold text-white">

                          UI/UX Design

                        </h5>

                        <p className="text-xs text-zinc-400 mt-1">

                          Merancang antarmuka yang intuitif dan meningkatkan

                          user experience.

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* CONTACT SECTION */}

        <section id="contact" className="py-20">

          <div className="mx-auto max-w-7xl px-6">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

              {/* Contact Info */}

              <div className="md:col-span-5 space-y-6">

                <div>

                  <span className="text-[11px] text-[var(--aksen)] uppercase tracking-widest block">

                    Hubungi

                  </span>

                  <h2 className="font-display text-3xl font-bold tracking-tight text-white mt-2">

                    Mari Terhubung dan Berdiskusi

                  </h2>

                </div>

                <p className="text-zinc-400 text-sm leading-relaxed">

                  Terima kasih telah mengunjungi portofolio saya. Silakan

                  kirimkan pesan apabila Anda ingin bertanya atau berdiskusi

                  mengenai proyek dan teknologi.

                </p>

                {/* Contact Info Boxes */}

                <div className="space-y-3 pt-4 text-xs">

                  <div className="flex items-center gap-2 text-zinc-300">

                    <span className="text-[var(--aksen)] text-xs min-w-fit">

                      [EMAIL]

                    </span>

                    <span className="text-zinc-400">

                      fikrieza69@gmail.com

                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-zinc-300">

                    <span className="text-[var(--aksen)] text-xs min-w-fit">

                      [WAKTU]

                    </span>

                    <span className="text-zinc-400">

                      Senin - Jumat | 09:00 - 18:00 WIB

                    </span>

                  </div>

                  <div className="flex items-center gap-3 pt-2">

                    <span className="h-2 w-2 rounded-full bg-[var(--aksen)]" />

                    <span className="text-zinc-500 italic text-[10px]">

                      Aktif dan siap dihubungi

                    </span>

                  </div>

                </div>

              </div>

              {/* Contact Form Container */}

              <div className="md:col-span-7">

                <ContactForm onSuccess={handleContactSuccess} />

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER SECTION */}

      <footer className="bg-[var(--bg)] cekung py-10">

        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-2">

            <div className="h-7 w-7 rounded-lg bg-[var(--bg)] timbul flex items-center justify-center font-display font-bold text-[10px] text-[var(--aksen)]">

              MF

            </div>

            <p className="text-xs text-zinc-400">

              © Muhammad Fiqri Fahreza.

            </p>

          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-400">

            <button

              id="footer-btn-cms-open"

              onClick={() => {

                if (user && isAdmin) {

                  setShowAdminPanel(true);

                  recordEvent("visit", "Membuka Admin panel dari footer");

                } else {

                  handleLogin();

                }

              }}

              className="tombol text-[var(--aksen)] rounded-xl px-2.5 py-1 transition-all duration-300 cursor-pointer flex items-center gap-1.5 bg-[var(--bg)] timbul"

            >

              <Database className="h-3 w-3" />

              Kelola

            </button>

            <span className="h-3 w-px bg-white/10" />

            <button

              id="footer-scroll-to-top"

              onClick={() => scrollToSection("hero")}

              className="hover:text-[var(--aksen)] transition-colors duration-300"

            >

              KEMBALI KE ATAS ↑

            </button>

          </div>

        </div>

      </footer>

      {/* PROJECT DETAIL MODAL */}

      <AnimatePresence>

        {selectedProject && (

          <ProjectDetail

            project={selectedProject}

            onClose={() => setSelectedProject(null)}

          />

        )}

      </AnimatePresence>

      {/* ADMIN PANEL MODAL */}

      <AnimatePresence>

        {showAdminPanel && user && isAdmin && (

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