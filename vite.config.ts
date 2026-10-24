import { defineConfig, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

interface VitestConfigExtension {
  plugins?: unknown[];
  server?: {
    port?: number;
  };
  ssr?: {
    external?: string[];
  };
  test?: {
    environment?: string;
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
            const { handleApiRequest } = await import('./src/server/apiHandler.js');
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
  plugins: [react(), careRouteApiPlugin()],
  server: {
    port: 5173,
  },
  ssr: {
    external: ['node:sqlite', 'sqlite'],
  },
  test: {
    environment: 'node',
    server: {
      deps: {
        external: ['node:sqlite', 'sqlite'],
      },
    },
  },
};

export default defineConfig(config as never);
