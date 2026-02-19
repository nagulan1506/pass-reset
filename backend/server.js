import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// CORS: allow FRONTEND_URL (comma-separated), any *.netlify.app, and localhost
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((s) => s.trim()).filter(Boolean)
  : [];
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const allAllowed = [...new Set([...allowedOrigins, ...defaultOrigins])];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allAllowed.includes(origin)) return true;
  if (origin.endsWith('.netlify.app') && origin.startsWith('https://')) return true;
  return false;
}

app.use(cors({
  origin: (origin, cb) => {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Password reset API', docs: '/api/auth – register, login, forgot-password, reset-password', health: '/health' });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
