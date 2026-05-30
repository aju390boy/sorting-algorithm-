// server/index.js

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

// ── CORS ────────────────────────────────────────────────
// Allow localhost for dev + Vercel URL for production
const allowedOrigins = [
  'http://localhost:5173',                   // local dev
  process.env.CLIENT_URL,                    // Vercel URL (set on Render)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use('/api/sort', require('./routes/sortRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '✅ Sorting API is running!' });
});

// ── Start ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
