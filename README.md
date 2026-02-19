# Password Reset Flow – MERN App

Full-stack auth app with **Register**, **Login**, **Forgot password**, and **Reset password** (email link).  
Frontend: **React** (Vite). Backend: **Node.js + Express**. Database: **MongoDB**.  
Designed for **Netlify** (frontend) and **Render** (backend).

## Features

- User registration and login (JWT)
- Forgot password: request reset link via email
- Reset password: set new password via link (token valid 1 hour)
- Responsive, modern UI (dark theme)
- Protected routes and auth state

## Tech Stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express, Mongoose
- **Auth:** JWT, bcrypt, password reset token
- **Email:** SendGrid (optional; link is logged if no API key)

---

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, FRONTEND_URL (e.g. http://localhost:3000), optional SENDGRID_API_KEY & FROM_EMAIL
npm install
npm run dev
```

Runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000 (or leave empty to use same host with Vite proxy)
npm install
npm run dev
```

Runs at `http://localhost:3000`. Vite proxy forwards `/api` to the backend when `VITE_API_URL` is unset.

### MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/atlas) and set `MONGODB_URI` in `backend/.env`.

---

## Deployment

### Backend (Render)

1. Create a **Web Service** and connect the `backend` folder (or repo root and set root to `backend`).
2. **Build:** `npm install`
3. **Start:** `npm start`
4. **Environment variables:**

   | Variable         | Description                                      |
   |------------------|--------------------------------------------------|
   | `MONGODB_URI`    | MongoDB connection string                        |
   | `JWT_SECRET`     | Secret for JWT (use a long random string)        |
   | `FRONTEND_URL`   | Netlify app URL (e.g. `https://your-app.netlify.app`) |
   | `SENDGRID_API_KEY` | SendGrid API key (for reset emails)           |
   | `FROM_EMAIL`     | Sender email (e.g. verified in SendGrid)         |

5. Copy the Render URL (e.g. `https://pass-reset-api.onrender.com`).

### Frontend (Netlify)

1. Connect the `frontend` folder (or repo and set base directory to `frontend`).
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. **Environment variable:**  
   `VITE_API_URL` = your Render backend URL (e.g. `https://pass-reset-api.onrender.com`)
5. Deploy. The repo includes `public/_redirects` for SPA routing.

### SendGrid (reset emails)

1. Sign up at [SendGrid](https://sendgrid.com).
2. Create an API key and set `SENDGRID_API_KEY`.
3. Verify a sender in SendGrid and set `FROM_EMAIL`.  
If these are not set, the backend still works but only logs the reset link instead of sending email.

---

## API (Backend)

| Method | Endpoint               | Body / Notes                    |
|--------|------------------------|---------------------------------|
| POST   | `/api/auth/register`   | `{ name, email, password }`     |
| POST   | `/api/auth/login`      | `{ email, password }`           |
| GET    | `/api/auth/me`         | Bearer token                    |
| POST   | `/api/auth/forgot-password` | `{ email }`                |
| POST   | `/api/auth/reset-password`  | `{ token, password }` (token from email link) |

---

## Project Structure

```
pass reset/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── routes/auth.js
│   ├── utils/email.js
│   ├── utils/token.js
│   ├── server.js
│   ├── .env.example
│   └── render.yaml
├── frontend/
│   ├── public/_redirects
│   ├── src/
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── vite.config.js
└── README.md
```
