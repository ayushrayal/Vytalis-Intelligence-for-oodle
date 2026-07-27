import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { envConfig } from './config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Define Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 2. Configure CORS Options
const corsOptions = {
  origin: (origin, callback) => {
   
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Blocked by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// 3. Apply Global Middleware (CORS MUST be first or very early)
app.use(cors(corsOptions));

// Handle preflight explicitly if needed, though cors() usually handles this automatically
// app.options('*', cors(corsOptions)); // Usually redundant if app.use(cors()) is present

app.use(helmet()); // Helmet after CORS is generally fine, but can be before too
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Define Routes (AFTER CORS middleware)
app.use('/api/v1/auth', authRoutes);
app.use('/api/auth', authRoutes); // Consider removing duplicate if not needed
app.use('/api/v1/analytics', analyticsRoutes);

// 5. Static Files & Production Logic
if (process.env.NODE_ENV === 'production') {
  // Change 'dist' to 'public' to match your vite.config.js
  const staticPath = path.join(__dirname, 'public'); 
  
  app.use(express.static(staticPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}    

// 6. Error Handler (LAST)
app.use(errorHandler);

export default app;   