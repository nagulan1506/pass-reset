# Environment Variables & Commands

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port (default: 5000) | `5000` |
| `MONGODB_URI` | **Yes** | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | **Yes** | Secret for signing JWTs (use a long random string) | `my-super-secret-key-xyz-123` |
| `JWT_EXPIRES_IN` | No | JWT expiry (default: 7d) | `7d` |
| `FRONTEND_URL` | **Yes** (for CORS & reset link) | Your frontend URL | `http://localhost:3000` (local) or `https://your-app.netlify.app` (prod) |
| `SENDGRID_API_KEY` | No* | SendGrid API key for reset emails | `SG.xxxxxxxxxxxxxxxx` |
| `FROM_EMAIL` | No* | Sender email (e.g. verified in SendGrid) | `noreply@yourdomain.com` |

\* If omitted, reset link is only logged in the server console (no email sent).

---

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | **Yes** (when not using proxy) | Backend API base URL | `http://localhost:5000` (local) or `https://your-api.onrender.com` (prod) |

- **Local:** Use `http://localhost:5000` or leave empty if you use Vite’s proxy (see `vite.config.js`).
- **Netlify:** Set to your Render backend URL, e.g. `https://pass-reset-api.onrender.com`.

---

## Commands

### Local development

**Terminal 1 – Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI, JWT_SECRET, FRONTEND_URL (e.g. http://localhost:3000)
npm install
npm run dev
```
→ Server at `http://localhost:5000`

**Terminal 2 – Frontend**
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000 (or leave empty to use proxy)
npm install
npm run dev
```
→ App at `http://localhost:3000`

---

### Build & run (production-like)

**Backend**
```bash
cd backend
npm install
npm start
```

**Frontend (build only)**
```bash
cd frontend
npm install
npm run build
```
→ Output in `frontend/dist/`. To preview: `npm run preview`.

---

### Deployment

**Render (backend)**  
- Build command: `npm install`  
- Start command: `npm start`  
- Root: `backend` (if repo root is project root)  
- Add env vars in Render dashboard: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `SENDGRID_API_KEY`, `FROM_EMAIL` (optional).

**Netlify (frontend)**  
- Base directory: `frontend`  
- Build command: `npm run build`  
- Publish directory: `frontend/dist` (or `dist` if base is `frontend`)  
- Env var: `VITE_API_URL` = your Render backend URL (e.g. `https://your-api.onrender.com`).

---

## Copy-paste .env examples

**Backend (local)** – create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/YOUR_DB
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
SENDGRID_API_KEY=
FROM_EMAIL=
```

**Backend (Render)** – set in dashboard:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-app.netlify.app
SENDGRID_API_KEY=SG.xxx
FROM_EMAIL=noreply@yourdomain.com
```

**Frontend (local)** – create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

**Frontend (Netlify)** – set in dashboard:
```env
VITE_API_URL=https://your-api.onrender.com
```
