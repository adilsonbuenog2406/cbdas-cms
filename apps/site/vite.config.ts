import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv, type PluginOption } from 'vite';

const LOG_ENDPOINT =
  'http://127.0.0.1:7615/ingest/e1503208-6096-42e6-82f7-77583d7d4b9e';
const SESSION_ID = '254193';

// #region agent log
function debugLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown> = {},
  runId = 'pre-fix',
) {
  fetch(LOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': SESSION_ID,
    },
    body: JSON.stringify({
      sessionId: SESSION_ID,
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

function redirectCmsToNext(): PluginOption {
  return {
    name: 'redirect-cms-to-next',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || (req.url !== '/cms' && !req.url.startsWith('/cms/'))) {
          next();
          return;
        }

        res.statusCode = 302;
        res.setHeader('Location', `http://127.0.0.1:3000${req.url}`);
        res.end();
      });
    },
  };
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';

  // #region agent log
  debugLog('A', 'vite.config.ts:entry', 'config loading', { mode, isProduction });
  // #endregion

  const plugins: PluginOption[] = [react()];

  if (!isProduction) {
    plugins.push(redirectCmsToNext());
  }

  // #region agent log
  debugLog('H', 'vite.config.ts:tailwind-import', 'loading tailwind plugin', { mode });
  // #endregion

  const { default: tailwindcss } = await import('@tailwindcss/vite');
  plugins.push(tailwindcss());

  // #region agent log
  debugLog('C', 'vite.config.ts:ready', 'config resolved', {
    mode,
    pluginCount: plugins.length,
    serverPort: 5173,
    serverHost: '127.0.0.1',
  });
  // #endregion

  return {
    base: isProduction ? env.VITE_BASE_PATH || './' : '/',
    plugins,
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: [
        { find: '@/components/ui', replacement: path.resolve(__dirname, 'components/ui') },
        { find: '@/lib', replacement: path.resolve(__dirname, 'lib') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    },
    server: {
      port: 5173,
      strictPort: true,
      host: '127.0.0.1',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.cursor/**',
          '**/fotospalestrantes/**',
        ],
      },
    },
  };
});
