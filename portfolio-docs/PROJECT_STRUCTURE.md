# 📁 STRUKTUR PROYEK PORTFOLIO

## Overview

```
portfolio/
├── 📄 File Konfigurasi & Setup
│   ├── .env.example ................. Template environment variables
│   ├── .env ......................... File konfigurasi lokal (BUAT SENDIRI)
│   ├── .gitignore ................... Git ignore rules
│   ├── package.json ................. Dependencies & scripts
│   ├── package-lock.json ............ Dependencies lock file
│   ├── tsconfig.json ................ TypeScript config
│   ├── vite.config.ts ............... Vite build config
│   └── README.md .................... Project readme
│
├── 📁 Source Code
│   └── src/
│       ├── 📄 main.tsx .............. React entry point
│       ├── 📄 App.tsx ............... Main application component (~600 lines)
│       ├── 📄 types.ts .............. TypeScript type definitions
│       ├── 📄 data.ts ............... Data & localStorage functions
│       ├── 📄 index.css ............. Global styles
│       │
│       └── 📁 components/ ........... React components
│           ├── ProjectCard.tsx ...... Component card proyek
│           ├── ProjectDetail.tsx .... Detail view proyek
│           ├── ContactForm.tsx ...... Form kontak
│           ├── AdminPanel.tsx ....... Panel admin
│           ├── Analytics.tsx ........ Analytics viewer
│           └── [Other components]
│
├── 📁 Assets
│   ├── images/ ...................... Static images
│   └── .aistudio/ ................... AI Studio metadata (bisa dihapus)
│
├── 📁 Build & Output (Generated)
│   ├── node_modules/ ................ Dependencies (auto-created)
│   └── dist/ ........................ Production build (generated saat `npm run build`)
│
└── 📄 index.html ................... HTML entry point

```

---

## 🔑 FILE KUNCI UNTUK DIKETAHUI

### 1. `.env` - Konfigurasi Lokal
**Status:** HARUS DIBUAT SENDIRI  
**Isi:**
```env
GEMINI_API_KEY="your_key"
APP_URL="http://localhost:3000"
```

### 2. `package.json` - Dependencies & Scripts
**Status:** Jangan diubah  
**Berisi:**
- Daftar library yang digunakan (React, Vite, Tailwind, dll)
- Scripts untuk dev, build, preview, lint, clean

**Available scripts:**
```bash
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Check TypeScript
npm run clean    # Clean dist folder
```

### 3. `src/App.tsx` - Aplikasi Utama
**Status:** Bisa dimodifikasi  
**Fungsi:** Component utama yang render seluruh aplikasi
**Berisi:**
- Layout struktur halaman
- State management untuk projects, messages, analytics
- Event handlers untuk interaksi user

### 4. `src/data.ts` - Data & Storage
**Status:** Bisa dimodifikasi  
**Fungsi:** Manage data & localStorage
**Penting:**
- `INITIAL_PROJECTS` - Data proyek default
- `loadProjects()` - Load dari localStorage
- `saveProjects()` - Save ke localStorage
- `loadMessages()` - Load pesan kontak
- Similar functions untuk analytics

### 5. `src/types.ts` - TypeScript Types
**Status:** Bisa ditambah  
**Berisi:**
- `interface Project` - Tipe data proyek
- `interface ContactMessage` - Tipe pesan kontak
- `interface AnalyticsEvent` - Tipe analytics event

### 6. `vite.config.ts` - Build Configuration
**Status:** Sudah optimal untuk lokal  
**Konfigurasi:**
- React plugin
- Tailwind CSS plugin
- Path aliases (@/ = root)
- Server HMR & file watching

### 7. `tsconfig.json` - TypeScript Configuration
**Status:** Jangan diubah  
**Setup untuk:**
- JSX React
- Module resolution
- Type checking

---

## 🔄 ALUR DATA APLIKASI

```
User Interaction
       ↓
   React Component
       ↓
   Event Handler (handleContactSuccess, etc)
       ↓
   State Update (setProjects, setMessages, etc)
       ↓
   Save to localStorage (saveProjects, saveMessages)
       ↓
   Data Persisted ✅
       ↓
   Component Re-render
       ↓
   UI Updated
```

---

## 🛠️ CARA MODIFY PROYEK

### Menambah Proyek Baru

Edit `src/data.ts`, tambahkan ke `INITIAL_PROJECTS`:

```typescript
{
  id: 'my-project',
  title: 'My Awesome Project',
  subtitle: 'Short description',
  description: 'Full description',
  content: '# Markdown content here',
  coverUrl: 'https://image.url',
  tags: ['React', 'TypeScript'],
  category: 'web',
  timeline: 'Jan - Dec 2025',
  role: 'Developer',
  client: 'Client Name',
  websiteUrl: 'https://website.com',
  githubUrl: 'https://github.com/username/repo',
  featured: true,
  views: 0
}
```

### Mengubah Style

Edit `src/index.css` atau ubah Tailwind classes di JSX:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
.custom-gradient {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
}
```

### Menambah Component Baru

1. Create file: `src/components/MyComponent.tsx`
2. Export component:
```typescript
export default function MyComponent() {
  return <div>My Component</div>
}
```
3. Import di `App.tsx`:
```typescript
import MyComponent from './components/MyComponent';
```

---

## 📊 STATE MANAGEMENT FLOW

Data di aplikasi dikelola di `App.tsx`:

```typescript
// Global states
const [projects, setProjects] = useState<Project[]>([]);
const [messages, setMessages] = useState<ContactMessage[]>([]);
const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

// Layout states
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [categoryFilter, setCategoryFilter] = useState<string>('all');
const [showAdminPanel, setShowAdminPanel] = useState(false);

// Tracking states
const [activeSeconds, setActiveSeconds] = useState(0);
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

Setiap state change → auto-save ke localStorage → DOM re-render

---

## 🎨 COMPONENT HIERARCHY

```
App
├── Header (Navigation)
├── HeroSection
├── SkillsShowcase
├── ProjectsSection
│   └── ProjectCard (multiple)
├── ContactSection
│   └── ContactForm
├── AdminPanel (conditional)
│   ├── ProjectList
│   ├── MessageList
│   └── AnalyticsList
└── Footer
```

---

## 🔐 DATA PERSISTENCE

Aplikasi menggunakan **Browser's localStorage**:

```javascript
// Save data
localStorage.setItem('portfolio_projects', JSON.stringify(projects))

// Load data
const stored = localStorage.getItem('portfolio_projects')
const projects = stored ? JSON.parse(stored) : INITIAL_PROJECTS
```

**Keuntungan:**
- ✅ Instant save - tidak perlu server
- ✅ Offline capable
- ✅ User data tersimpan di browser mereka

**Keterbatasan:**
- ~5-10MB per domain
- Hilang jika cache dihapus
- Tidak sync antar device

**Untuk Production**, Anda bisa upgrade ke:
- Backend database (Firebase, Supabase, etc)
- Cloud storage
- Server-side storage

---

## 🚀 BUILD OUTPUT

Setelah `npm run build`, folder `dist/` akan berisi:

```
dist/
├── index.html ..................... Optimized HTML (~0.5KB gzipped)
├── assets/
│   ├── index-xxxxx.js ............ Bundled JS (~78KB gzipped)
│   └── index-xxxxx.css ........... Bundled CSS
└── vite.svg ...................... Assets

Total Size: ~100-150KB (production optimized)
```

File ini siap untuk dideploy ke:
- Vercel
- Netlify
- GitHub Pages
- Any static host

---

## 📝 ENVIRONMENT VARIABLES

Variables yang support:

```env
# Required
GEMINI_API_KEY     # API key untuk Google Gemini

# Optional
APP_URL            # Base URL aplikasi
VITE_API_BASE      # Backend API endpoint
VITE_ENABLE_ANALYTICS # Enable/disable tracking
DISABLE_HMR        # Disable hot module replacement
```

Akses di kode:
```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const appUrl = import.meta.env.VITE_APP_URL
```

---

## 📦 DEPENDENCIES

**Production:**
- `react@19` - UI library
- `react-dom@19` - React renderer
- `@google/genai` - Gemini API client
- `vite@6` - Build tool
- `tailwindcss@4` - CSS framework
- `lucide-react` - Icon library
- `motion@12` - Animation library
- `express` - Optional backend
- `dotenv` - Env variables

**Development:**
- `typescript` - Type checking
- `@tailwindcss/vite` - Tailwind integration
- `@vitejs/plugin-react` - React support
- Various type definitions

Total dependencies: ~200 packages (auto-managed oleh npm)

---

## ✅ CHECKLIST STRUKTUR

- [ ] `.env` file sudah dibuat
- [ ] `node_modules/` sudah terinstall (`npm install`)
- [ ] `npm run dev` berjalan tanpa error
- [ ] Aplikasi accessible di `http://localhost:3000`
- [ ] Semua proyek ditampilkan dengan baik
- [ ] Admin panel bisa diakses & berfungsi
- [ ] localStorage working (data tersimpan setelah refresh)

---

**Sekarang Anda sudah siap untuk modifikasi & develop proyek ini! 🚀**
