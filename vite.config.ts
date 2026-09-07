import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ttsPlugin = () => ({
  name: 'tts-api',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api/tts')) {
        try {
          let rawText = '';
          let persona = 'noura';

          if (req.method === 'POST') {
            const body = await new Promise<string>((resolve) => {
              let data = '';
              req.on('data', (chunk: any) => { data += chunk; });
              req.on('end', () => resolve(data));
            });
            try {
              const json = JSON.parse(body);
              rawText = json.text || '';
              persona = json.persona || 'noura';
            } catch (_) {}
          } else {
            const parsedUrl = new URL(req.url, 'http://localhost:3000');
            rawText = parsedUrl.searchParams.get('text') || '';
            persona = parsedUrl.searchParams.get('persona') || 'noura';
          }

          const text = rawText
            .replace(/\{[\s\S]*?\}/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/[*_#`~]/g, '')
            .replace(/•/g, '')
            .replace(/\|/g, ' ')
            .replace(/\(.*?\)/g, '')
            .replace(/\[.*?\]/g, '')
            .replace(/https?:\/\/\S+/g, '')
            .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}]/gu, '')
            .replace(/[\n\r]+/g, ' ')
            .replace(/\+/g, ' زائد ')
            .replace(/\s+/g, ' ')
            .trim();

          if (!text) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Text parameter is required' }));
            return;
          }

          const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');
          const voice = persona === 'faris' ? 'ar-SA-HamedNeural' : 'ar-SA-ZariyahNeural';
          const tts = new MsEdgeTTS();
          await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
          const { audioStream } = tts.toStream(text);

          res.statusCode = 200;
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          audioStream.pipe(res);

          audioStream.on('error', (err: any) => {
            console.warn('[TTS Dev Plugin] Stream error:', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end('TTS Stream Error');
            }
          });
          return;
        } catch (err: any) {
          console.warn('[TTS Dev Plugin] Execution error:', err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'TTS generation failed' }));
          }
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), ttsPlugin()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react/jsx-runtime']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-query']
  },
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.git/**', '**/public/**', '**/dist/**']
    }
  },
  build: {
    copyPublicDir: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('kasMonafasatSheetData.json')) {
            return 'data-kas-monafasat';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-i18next/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/jspdf')) {
            return 'vendor-pdf';
          }
          if (id.includes('node_modules/xlsx')) {
            return 'vendor-xlsx';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/date-fns')) {
            return 'vendor-dates';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          if (id.includes('node_modules/@sentry')) {
            return 'vendor-sentry';
          }
        }
      }
    }
  }
})
