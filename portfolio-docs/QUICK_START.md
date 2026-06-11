# ⚡ QUICK START - JALANKAN PROYEK DALAM 5 MENIT

## 📋 LANGKAH CEPAT

### 1️⃣ Persiapan (1 menit)
```bash
# Pastikan Node.js sudah install
node --version    # Harus v18+
npm --version
```

### 2️⃣ Setup Proyek (2 menit)
```bash
# Navigate ke folder proyek
cd /path/ke/portfolio

# Install dependencies
npm install
```

### 3️⃣ Konfigurasi (1 menit)
```bash
# Buat file .env dari template
# Copy isi .env.example ke file baru bernama .env
# Pada Windows: rename .env.example .env
# Pada Mac/Linux: cp .env.example .env
```

Edit file `.env`:
```env
GEMINI_API_KEY="your_api_key_or_leave_as_is"
APP_URL="http://localhost:3000"
```

### 4️⃣ Jalankan! (1 menit)
```bash
npm run dev
```

Akses: **http://localhost:3000** ✅

---

## 🔧 PERINTAH PENTING

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan dev server (localhost:3000) |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check TypeScript errors |
| `npm run clean` | Hapus folder dist |

---

## 📂 FILE PENTING YANG PERLU TAHU

```
portfolio/
├── .env ........................ Konfigurasi lokal (BUAT SENDIRI)
├── .env.example ................ Template (jangan diubah)
├── vite.config.ts .............. Setup build tool
├── package.json ................ Dependencies list
├── src/
│   ├── App.tsx ................. Aplikasi utama
│   ├── main.tsx ................ React entry point
│   ├── data.ts ................. Data & localStorage
│   └── components/ ............. React components
└── index.html .................. HTML entry
```

---

## ⚙️ KONFIGURASI .ENV

Salin dari `.env.example` dan ubah:

**Option 1: Tanpa Gemini API (Langsung bisa dijalankan)**
```env
GEMINI_API_KEY=""
APP_URL="http://localhost:3000"
```

**Option 2: Dengan Gemini API**
```env
GEMINI_API_KEY="your_actual_api_key"
APP_URL="http://localhost:3000"
```

Dapatkan API key dari: https://makersuite.google.com/app/apikey

---

## 🚨 TROUBLESHOOTING CEPAT

| Error | Solusi |
|-------|--------|
| `Port 3000 in use` | `npm run dev -- --port 3001` |
| `node_modules error` | `rm -rf node_modules && npm install` |
| `Module not found` | Cek `.env` setup, jalankan `npm install` |
| `TypeScript errors` | Run `npm run lint` untuk details |

---

## ✅ VERIFIKASI SETUP BERHASIL

Setelah `npm run dev`, Anda harus melihat:

```
VITE v6.2.3  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  Press h + enter to show help
```

✅ Buka browser ke `http://localhost:3000`
✅ Lihat halaman portfolio loaded
✅ Coba click project cards
✅ Check browser DevTools > Console (tidak ada error merah)

---

## 📝 NEXT STEPS

1. **Explore codebase**
   - Lihat `src/App.tsx` - struktur utama
   - Lihat `src/components/` - React components
   - Lihat `src/data.ts` - data & functions

2. **Customize data**
   - Edit `src/data.ts` untuk ubah proyek/portofolio
   - Data otomatis tersimpan di localStorage

3. **Modify styles**
   - Edit `src/index.css` untuk global styles
   - Gunakan Tailwind classes di JSX

4. **Build & Deploy**
   - Run `npm run build`
   - Deploy folder `dist/` ke hosting
   - Recommended: Vercel, Netlify, atau server sendiri

---

## 🎯 STATUS

✅ Aplikasi siap independent dari Google AI Studio
✅ Semua akses & konfigurasi sudah lokal di komputer Anda  
✅ Bisa dikembangkan & deploy dimana saja
✅ Production ready

---

**Perlu bantuan?** Lihat file `SETUP_GUIDE_INDONESIAN.md` untuk dokumentasi lengkap.
