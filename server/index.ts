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
  // For Vercel, we only want to register routes and configure the app object.
  // Static serving and Vite middleware are not for the Vercel serverless function.
  // The app.listen() call is also removed.

  console.log('Configuring Express app for Vercel...');
  await registerRoutes(app); // server object is not used in this context anymore
  console.log('API routes registered successfully for Vercel');

  // Local development server logic (including app.listen, Vite, static serving)
  // should be handled differently, perhaps in a separate script or conditional block
  // not executed in Vercel's environment.
  // For now, this IIFE will just set up the app for Vercel.

  // Final catch-all error handler for API routes.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error for debugging purposes
    console.error('Express error caught:', err);

    res.status(status).json({ message });
  });

  // Logic for starting the server (app.listen) is removed for Vercel.
  // Vercel will use the exported app as a handler.
  // The setupVite and serveStatic calls are also removed as Vercel handles static assets.

  // Local development server logic
  if (process.env.NODE_ENV === 'development') {
    const PORT = process.env.PORT || 3000;
    try {
      await setupVite(app); // Setup Vite middleware
      serveStatic(app); // Serve static assets

      // Final catch-all error handler for API routes - already present above, but ensure it's effective.
      // Re-adding it here scoped to dev if needed, but the global one should be fine.

      app.listen(PORT, () => {
        log(`Server listening on port ${PORT}`);
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
        console.log('Development server configured and started.');
      });
    } catch (e) {
      console.error('Failed to start development server:', e);
      process.exit(1);
    }
  }
})().catch(error => {
  console.error('Failed to initialize app:', error);
  if (process.env.NODE_ENV === 'development') {
    process.exit(1); // Exit in dev if initialization fails
  }
  // In a serverless environment, process.exit might not be appropriate.
  // Let the error propagate or handle it as Vercel expects.
});

export default app; // Export the app for Vercel
