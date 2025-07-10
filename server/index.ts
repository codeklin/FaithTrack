import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { log } from './logger';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// A simple logger for API requests
app.use('/api', (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.originalUrl} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

(async () => {
  console.log('Starting server...');
  const server = await registerRoutes(app);
  console.log('Routes registered successfully');

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log('Environment check:', {
    'app.get("env")': app.get("env"),
    'process.env.NODE_ENV': process.env.NODE_ENV
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Setting up Vite for development');
    await setupVite(app, server);
  } else {
    console.log('Setting up static file serving for production');
    serveStatic(app);
  }

  // Final catch-all error handler. This should be the last `app.use()`.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error for debugging purposes
    console.error('Express error caught:', err);

    res.status(status).json({ message });
  });

  // Use Vercel's port or fallback to 5000 for local development
  const port = process.env.PORT || 5000;
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

  server.listen({
    port: Number(port),
    host,
  }, () => {
    log(`serving on port ${port} (${process.env.NODE_ENV || 'development'})`);
  });
})().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
