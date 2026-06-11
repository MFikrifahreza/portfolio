# 📚 PANDUAN SETUP PROYEK PORTFOLIO LOKAL DI VS CODE

Panduan lengkap untuk menjalankan proyek portfolio dari Google AI Studio secara mandiri di komputer Anda.

---

## 🎯 RINGKASAN

Proyek Anda adalah aplikasi React + Vite yang awalnya dikonfigurasi untuk Google AI Studio. Kami akan mengubahnya agar berjalan sepenuhnya di lokal tanpa dependensi pada AI Studio.

**Stack Teknologi:**
- React 19
- Vite (Build Tool)
- TypeScript
- Tailwind CSS
- @google/genai (untuk integrasi AI)
- Express (Backend optional)

---

## 📋 LANGKAH 1: PERSIAPAN AWAL

### 1.1 Pastikan Anda Sudah Install:

```bash
# Windows/Mac/Linux
# Install Node.js LTS dari: https://nodejs.org/

# Verifikasi instalasi
node --version
npm --version
```

**Rekomendasi:** Node.js v18+ atau v20+

---

## 🚀 LANGKAH 2: SETUP PROYEK

### 2.1 Copy Folder Proyek ke Tempat Kerja Anda

1. **Ekstrak file `portfolio.zip` ke folder mana saja di komputer Anda**
   - Contoh: `C:\Users\YourName\Projects\portfolio` (Windows)
   - Atau: `~/Projects/portfolio` (Mac/Linux)

### 2.2 Buka di VS Code

```bash
# Buka terminal/command prompt
# Navigasi ke folder proyek
cd path/ke/portfolio

# Buka di VS Code
code .
```

### 2.3 Install Dependencies

Di VS Code, buka Terminal baru (Ctrl + `) dan jalankan:

```bash
npm install
```

**Tunggu sampai selesai** (biasanya 2-5 menit tergantung internet)

---

## ⚙️ LANGKAH 3: KONFIGURASI ENVIRONMENT

### 3.1 Setup File `.env`

1. **Lihat file `.env.example`** (sudah ada di folder proyek)

2. **Buat file baru bernama `.env`** di root folder proyek

3. **Copy isi dari `.env.example` ke `.env`:**

```env
# API Configuration
GEMINI_API_KEY="YOUR_API_KEY_HERE"

# App URL Configuration  
APP_URL="http://localhost:3000"
```

### 3.2 Dapatkan Gemini API Key (Opsional)

Jika ingin menggunakan fitur AI:

1. Kunjungi: https://makersuite.google.com/app/apikey
2. Klik "Create API Key"
3. Copy API key Anda
4. Paste ke `.env`:

```env
GEMINI_API_KEY="paste_key_anda_di_sini"
```

**Catatan:** Jika belum punya, biarkan dulu dan lanjutkan dengan fitur AI disabled.

---

## 💻 LANGKAH 4: MENJALANKAN PROYEK

### 4.1 Development Mode

Di terminal VS Code, jalankan:

```bash
npm run dev
```

**Output yang benar:**
```
VITE v6.2.3  ready in 456 ms

➜  Local:   http://localhost:3000/
➜  Press h + enter to show help
```

### 4.2 Akses Aplikasi

Buka browser Anda dan kunjungi:
- `http://localhost:3000`

**Selesai!** Aplikasi Anda sudah berjalan lokal.

---

## 🔄 LANGKAH 5: MENGUBAH KONFIGURASI DARI AI STUDIO KE LOKAL

### 5.1 Folder & File Penting

```
portfolio/
├── .env                          # ← File konfigurasi lokal (buat baru)
├── .env.example                  # ← Template (jangan diubah)
├── vite.config.ts               # ← Setup Vite
├── package.json                 # ← Dependencies
├── src/
│   ├── App.tsx                  # ← Aplikasi utama
│   ├── main.tsx                 # ← Entry point React
│   ├── data.ts                  # ← Data lokal (localStorage)
│   ├── types.ts                 # ← TypeScript types
│   ├── index.css                # ← Global styles
│   └── components/              # ← React components
├── index.html                   # ← HTML entry
└── node_modules/                # ← Dependencies (auto-created)
```

### 5.2 Hilangkan Dependensi AI Studio

Bagian-bagian yang perlu diubah:

**File: `vite.config.ts`**

Status saat ini sudah **OK untuk lokal**. File ini hanya disable HMR jika `DISABLE_HMR=true`.

```typescript
// Sudah benar - tidak ada yang perlu diubah
server: {
  hmr: process.env.DISABLE_HMR !== 'true',
  watch: process.env.DISABLE_HMR === 'true' ? null : {},
}
```

**File: `src/App.tsx`**

Status saat ini sudah **OK untuk lokal**. Aplikasi menggunakan localStorage untuk data persistence, bukan API Studio.

---

## 🛠️ LANGKAH 6: FITUR-FITUR UTAMA

### 6.1 Data Management

Data proyek **disimpan di localStorage browser**:

```typescript
// Di src/data.ts
// Menggunakan localStorage untuk penyimpanan lokal
localStorage.setItem('projects', JSON.stringify(projects))
localStorage.getItem('projects')
```

**Artinya:** Data Anda tersimpan di browser, persisten sampai cache dihapus.

### 6.2 Fitur Admin Panel

Aplikasi memiliki admin panel untuk mengelola data:

1. Akses di aplikasi (tombol ada di bawah)
2. Tambah, edit, hapus proyek
3. Lihat analytics dan pesan kontak

---

## 🏗️ LANGKAH 7: BUILD UNTUK PRODUCTION

Saat proyek siap deploy:

### 7.1 Build Optimized

```bash
npm run build
```

**Output:**
```
vite v6.2.3 building for production...
✓ 234 modules transformed
dist/index.html                  0.50 kB │ gzip: 0.30 kB
dist/assets/index-xxxxx.js   234.50 kB │ gzip: 78.45 kB
```

### 7.2 File yang Dihasilkan

```
dist/                # Folder untuk deploy
├── index.html       # HTML static
├── assets/
│   ├── index-xxxxx.js       # Bundle JavaScript
│   └── index-xxxxx.css      # Bundle CSS
```

### 7.3 Test Build Lokal

```bash
npm run preview
```

Buka: `http://localhost:4173`

---

## 📚 LANGKAH 8: INTEGRASI DENGAN GOOGLE GEMINI API (OPSIONAL)

Jika ingin menambah fitur AI:

### 8.1 Install Package (sudah ada)

```bash
npm install @google/genai
```

### 8.2 Contoh Penggunaan

```typescript
import { GoogleGenerativeAI } from "@google/genai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const response = await model.generateContent("Tuliskan deskripsi proyek...");
```

### 8.3 Update .env

```env
VITE_GEMINI_API_KEY="your_api_key_here"
```

---

## 🐛 TROUBLESHOOTING

### Masalah 1: `Port 3000 already in use`

```bash
# Ubah port di vite.config.ts atau run dengan port berbeda
npm run dev -- --port 3001
```

### Masalah 2: `Module not found` atau Error Import

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install
```

### Masalah 3: Data tidak tersimpan

Pastikan localStorage tidak diblock:
- Browser DevTools (F12)
- Application tab
- Check Local Storage

### Masalah 4: TypeScript Error

```bash
# Jalankan type checking
npm run lint
```

---

## 📁 PERSIAPAN UNTUK DEPLOYMENT

### Opsi 1: Deploy ke Vercel (Recommended)

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/portfolio.git
git push -u origin main

# 2. Di Vercel.com: Import GitHub repo
# Vercel otomatis detect Vite project
# Click Deploy
```

### Opsi 2: Deploy ke Netlify

```bash
# Verifikasi build terlebih dahulu
npm run build

# Deploy ke Netlify
# Drag & drop folder 'dist/' ke https://app.netlify.com/drop
```

### Opsi 3: Self-Hosted (VPS/Cloud)

```bash
# 1. Build
npm run build

# 2. Upload folder 'dist/' ke server
# 3. Configure web server (Nginx/Apache) untuk serve dist/index.html

# Contoh Nginx config:
# location / {
#   try_files $uri /index.html;
# }
```

---

## ✅ CHECKLIST SETUP LENGKAP

- [ ] Install Node.js (v18+)
- [ ] Extract portfolio.zip
- [ ] Buka folder di VS Code
- [ ] Run `npm install`
- [ ] Buat file `.env` dari `.env.example`
- [ ] Run `npm run dev`
- [ ] Akses `http://localhost:3000`
- [ ] Cek semua fitur berfungsi
- [ ] (Optional) Dapatkan Gemini API Key
- [ ] (Optional) Customize data di `src/data.ts`

---

## 🔗 LINK PENTING

| Sumber | Link |
|--------|------|
| React | https://react.dev |
| Vite | https://vitejs.dev |
| Tailwind CSS | https://tailwindcss.com |
| TypeScript | https://www.typescriptlang.org |
| Google Gemini API | https://makersuite.google.com/app/apikey |
| VS Code | https://code.visualstudio.com |

---

## 📞 BANTUAN TAMBAHAN

### Perintah Umum di Terminal:

```bash
# Jalankan development server
npm run dev

# Check untuk TypeScript errors
npm run lint

# Build untuk production
npm run build

# Preview production build lokal
npm run preview

# Hapus folder dist
npm run clean

# Lihat semua available scripts
npm run
```

### Environment Variables:

Variable yang bisa Anda set di `.env`:

```env
# Required
GEMINI_API_KEY=your_key_here

# Optional
APP_URL=http://localhost:3000
VITE_API_BASE=http://localhost:3000/api
VITE_DISABLE_ANALYTICS=false
```

---

## 🎉 SELESAI!

Proyek Anda sekarang fully independent dari Google AI Studio dan dapat dikembangkan sepenuhnya di lokal maupun production.

**Dari sini Anda bisa:**
- ✅ Modify code tanpa khawatir
- ✅ Add custom features
- ✅ Deploy ke platform apapun
- ✅ Integrate dengan backend sendiri
- ✅ Optimize untuk production

---

**Last Updated:** 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
