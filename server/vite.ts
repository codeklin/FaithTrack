import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: {
      server,
      // Explicitly set the HMR port to the application's port.
      // This ensures the client-side HMR connection targets the correct server.
      port: Number(process.env.PORT) || 5000,
    },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "spa", // Let Vite handle serving index.html for SPA fallback
  });

  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  // In production, the public directory is relative to the server bundle
  const distPath = path.resolve(import.meta.dirname, "public");

  // Fallback for different deployment environments
  const fallbackDistPath = path.resolve(process.cwd(), "dist", "public");
  const finalDistPath = fs.existsSync(distPath) ? distPath : fallbackDistPath;

  if (!fs.existsSync(finalDistPath)) {
    throw new Error(
      `Could not find the build directory: ${finalDistPath}, make sure to build the client first`,
    );
  }

  // Serve static files with proper headers for PWA
  app.use(express.static(finalDistPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Set proper MIME types for PWA files
      if (path.endsWith('.webmanifest') || path.endsWith('manifest.json')) {
        res.setHeader('Content-Type', 'application/manifest+json');
      }
      if (path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml');
      }
      // Cache control for different file types
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0'); // No cache for HTML
      }
    }
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(finalDistPath, "index.html"));
  });
}
