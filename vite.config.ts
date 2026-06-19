import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type PluginOption } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';

  const plugins: PluginOption[] = [react()];
  if (isProduction) {
    plugins.push(tailwindcss());
  }

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
