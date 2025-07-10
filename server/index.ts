import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from './logger';
// Vite and http imports are now dynamically imported for local dev

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API request logger
app.use('/api', (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.originalUrl} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Async IIFE to configure the app's API routes and error handling
(async () => {
  try {
    await registerRoutes(app);
    log('API routes registered.');

    // Final catch-all error handler for API routes
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      log('Express API error caught:', { message: err.message, stack: err.stack }, 'error');
      res.status(status).json({ message });
    });

    log('Express app API handling configured.');
  } catch (error) {
    log('Failed to initialize Express app API handling:', error, 'error');
    // If this setup fails, the app might not be usable.
    // For Vercel, an error here would likely fail the function initialization.
    // For local dev, the server might not start correctly.
  }
})();

// Local Development Server Setup
// This block only runs if NODE_ENV is 'development' and not in a Vercel environment
if (process.env.NODE_ENV === 'development' && !process.env.VERCEL_ENV) {
  (async () => {
    try {
      const http = await import('http');
      const { setupVite } = await import('./vite'); // Make sure setupVite is correctly exported

      const httpServer = http.createServer(app);

      log('Setting up Vite for local development...');
      // The 'server' parameter in setupVite is the http.Server instance for HMR
      await setupVite(app, httpServer);
      log('Vite setup complete for local development.');

      const port = process.env.PORT || 5000;
      httpServer.listen(port, () => {
        log(`Development server listening on http://localhost:${port}`);
      });
    } catch (devError) {
      log('Failed to start local development server:', devError, 'error');
      process.exit(1); // Exit if local dev server fails to start
    }
  })();
}

// This export is for Vercel (and potentially other serverless environments)
export default app;
