# 🔧 TROUBLESHOOTING & DEPLOYMENT GUIDE

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: `Port 3000 already in use`

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solusi:**

**Option A: Ubah port**
```bash
npm run dev -- --port 3001
# Akses: http://localhost:3001
```

**Option B: Kill proses yang menggunakan port 3000**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

Mac/Linux:
```bash
lsof -i :3000
kill -9 <PID>
```

---

### Issue 2: `Module not found` atau `Cannot find module`

**Error:**
```
Cannot find module '@/...' or its corresponding type declarations
```

**Solusi:**

```bash
# 1. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 2. Clear Vite cache
rm -rf dist .vite

# 3. Restart dev server
npm run dev
```

---

### Issue 3: `.env` variables not loading

**Error:**
```
VITE_GEMINI_API_KEY is undefined
```

**Solusi:**

1. **Pastikan file `.env` di root folder**
   ```bash
   # Cek file ada
   ls -la .env
   ```

2. **Pastikan format benar:**
   ```env
   GEMINI_API_KEY="your_key_here"
   APP_URL="http://localhost:3000"
   ```

3. **Pastikan restart dev server:**
   ```bash
   # Ctrl+C untuk stop
   # Ctrl+C untuk stop, lalu
   npm run dev
   ```

4. **Akses dengan benar di code:**
   ```typescript
   // ✅ Benar
   import.meta.env.VITE_GEMINI_API_KEY
   
   // ❌ Salah
   process.env.VITE_GEMINI_API_KEY
   ```

---

### Issue 4: localhost shows blank page

**Solusi:**

1. **Check browser console (F12)**
   - Ada error merah? Copy & search di Google

2. **Check terminal output**
   - Ada warning/error di terminal?

3. **Check if vite started correctly**
   ```
   ✓ VITE v6.2.3 ready in XXX ms
   ➜  Local:   http://localhost:3000/
   ```

4. **Clear browser cache**
   - DevTools → Application → Clear site data
   - Ctrl+Shift+Delete (hard refresh)

5. **Check network tab (DevTools)**
   - Semua requests (HTML, JS, CSS) status 200?

---

### Issue 5: TypeScript errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solusi:**

```bash
# Check all TS errors
npm run lint

# Fix auto-fixable errors
npm run lint -- --fix
```

Atau lihat error detail di VS Code:
- Bagian bawah: "PROBLEMS" tab
- Hover di error line untuk lihat detail

---

### Issue 6: Styles not applying (Tailwind not working)

**Solusi:**

1. **Pastikan `index.css` di-import di `main.tsx`:**
   ```typescript
   import './index.css'
   ```

2. **Pastikan Tailwind directives ada di `index.css`:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Restart dev server**
   ```bash
   npm run dev
   ```

4. **Check if class name typo**
   ```jsx
   // ✅ Correct
   <div className="bg-blue-500 p-4">
   
   // ❌ Wrong
   <div className="bgBlue500 padding4">
   ```

---

### Issue 7: Data not persisting (localStorage issue)

**Masalah:** Data hilang setelah refresh

**Solusi:**

1. **Check browser console:**
   ```javascript
   // Cek localStorage di console (F12)
   localStorage.getItem('portfolio_projects')
   ```

2. **Check if localStorage disabled:**
   - DevTools → Application → Storage
   - Lihat Local Storage tab

3. **Check browser settings:**
   - Pastikan cookies/storage tidak di-block
   - Cek incognito mode (tidak cache)

---

## 🚀 DEPLOYMENT GUIDES

### Option 1: Deploy ke Vercel (Recommended)

**Step 1: Push ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo.git
git push -u origin main
```

**Step 2: Deploy via Vercel**
1. Kunjungi https://vercel.com
2. Login dengan GitHub account
3. Click "Import Project"
4. Select repository Anda
5. Click "Deploy"

**Konfigurasi Environment Variables:**
1. Project Settings → Environment Variables
2. Add:
   ```
   GEMINI_API_KEY = your_api_key
   APP_URL = https://your-domain.vercel.app
   ```
3. Redeploy

**Auto-deployment:**
- Setiap push ke main → auto deploy
- Setiap pull request → preview deployment

---

### Option 2: Deploy ke Netlify

**Method A: Connect GitHub**
1. Kunjungi https://netlify.com
2. Login dengan GitHub
3. "New site from Git"
4. Select repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Deploy

**Method B: Drag & Drop**
1. Build locally: `npm run build`
2. Drag folder `dist/` ke https://app.netlify.com/drop
3. Instant deploy!

**Konfigurasi:**
1. Site settings → Build & deploy
2. Environment variables:
   ```
   VITE_GEMINI_API_KEY = your_key
   VITE_APP_URL = https://your-site.netlify.app
   ```

---

### Option 3: Deploy ke GitHub Pages

**Step 1: Setup GitHub Pages**
1. Push ke GitHub
2. Settings → Pages
3. Source → GitHub Actions
4. Select "Node.js" workflow

**Step 2: Create workflow file**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Pages

on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Step 3: Push & Deploy**
```bash
git add .github/workflows/deploy.yml
git commit -m "Add deploy workflow"
git push
```

---

### Option 4: Deploy ke Cloud Run (Google)

**Prerequisites:**
- Google Cloud account
- `gcloud` CLI installed

**Step 1: Create Dockerfile**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Install server (if using Express backend)
RUN npm install --save express

# Expose port
EXPOSE 3000

# Run production server
CMD ["npm", "run", "preview"]
```

**Step 2: Deploy**
```bash
gcloud run deploy portfolio \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

### Option 5: Self-Hosted (VPS/Server)

**Step 1: SSH ke server**
```bash
ssh user@your-server-ip
```

**Step 2: Setup environment**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone https://github.com/username/portfolio.git
cd portfolio
```

**Step 3: Setup & Build**
```bash
# Install dependencies
npm ci

# Create .env
cp .env.example .env
# Edit .env dengan config yang tepat

# Build
npm run build
```

**Step 4: Setup web server (Nginx)**

Create `/etc/nginx/sites-available/portfolio`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/portfolio/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Cache assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 5: Setup SSL (HTTPS)**
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

---

## 🔄 CONTINUOUS DEPLOYMENT

### Setup Auto-Deploy

**Option 1: Vercel (Automatic)**
- Push ke main branch → auto deploy
- Tidak perlu setup apapun

**Option 2: Custom GitHub Action**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /path/to/portfolio
            git pull
            npm ci
            npm run build
            sudo systemctl restart portfolio
```

Set secrets di GitHub:
- `HOST` = server IP
- `USER` = SSH username
- `SSH_KEY` = private SSH key

---

## 📊 PERFORMANCE OPTIMIZATION

### Before Production:

```bash
# Check bundle size
npm run build

# Review output
# Look for dist/ folder size
```

### Optimize:

1. **Images:**
   - Use modern formats (WebP)
   - Compress sebelum upload
   - Use CDN untuk hosting

2. **Code:**
   - Remove unused imports
   - Lazy load components if needed
   - Tree-shake dead code (Vite sudah otomatis)

3. **Caching:**
   - Assets hash untuk cache-busting
   - SWCache untuk offline support

---

## 🔒 SECURITY

**Before deploying:**

1. **Never commit `.env`**
   - Already in `.gitignore` ✓

2. **Rotate API keys**
   - Jangan gunakan key yang di-.env.example

3. **Use HTTPS**
   - Deploy dengan SSL certificate

4. **Validate user input**
   - ContactForm validation sudah ada ✓

5. **Set security headers**
   ```nginx
   # Nginx
   add_header X-Content-Type-Options "nosniff";
   add_header X-Frame-Options "DENY";
   add_header X-XSS-Protection "1; mode=block";
   ```

---

## 📈 MONITORING

### Setup Monitoring:

**Option 1: Vercel Analytics** (Built-in)
- Dashboard → Analytics
- Automatic CPU, memory, requests tracking

**Option 2: Sentry (Error Tracking)**
```bash
npm install @sentry/react
```

**Option 3: Custom Analytics**
```typescript
// Track user events
const trackEvent = (name, data) => {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ name, data })
  })
}
```

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] All code committed & pushed
- [ ] `.env` variables configured
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All links working
- [ ] Contact form tested
- [ ] Admin panel accessible
- [ ] Performance acceptable (< 3s load time)
- [ ] SEO meta tags set
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] DNS pointing correctly
- [ ] Email notifications setup

---

## 🎯 QUICK REFERENCE

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Check errors | `npm run lint` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Install deps | `npm install` |
| Update deps | `npm update` |
| Clear cache | `rm -rf dist .vite` |
| Full reset | `rm -rf node_modules dist .vite && npm install` |

---

**Happy deploying! 🚀**
