import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.join(projectRoot, 'frontend');

interface VitestConfigExtension {
  root?: string;
  envDir?: string;
  plugins?: unknown[];
  server?: {
    port?: number;
  };
  build?: {
    outDir?: string;
    emptyOutDir?: boolean;
  };
  ssr?: {
    external?: string[];
  };
  test?: {
    environment?: string;
    include?: string[];
    server?: {
      deps?: {
        external?: string[];
      };
    };
  };
}

function careRouteApiPlugin(): Plugin {
  return {
    name: 'careroute-api-server',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const reqWithUrl = req as { url?: string };
        if (reqWithUrl.url && reqWithUrl.url.startsWith('/api')) {
          try {
            // @ts-expect-error dynamic local server import
            const { handleApiRequest } = await import('./backend/apiHandler.js');
            await handleApiRequest(req, res);
          } catch (err: unknown) {
            console.error('Dev middleware error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
          return;
        }
        next();
      });
    },
  };
}

const config: VitestConfigExtension = {
  root: frontendRoot,
  envDir: projectRoot,
  plugins: [react(), careRouteApiPlugin()],
  server: {
    port: 5173,
  },
  ssr: {
    external: ['node:sqlite', 'sqlite'],
  },
  build: {
    outDir: path.join(projectRoot, 'dist'),
    emptyOutDir: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', '../backend/tests/**/*.test.ts'],
    server: {
      deps: {
        external: ['node:sqlite', 'sqlite'],
      },
    },
  },
};

export default defineConfig(config as never);
