import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import fs from 'fs';
import path from 'path';

// イベント画像を自動的に読み込む関数
function getEventImages() {
  const eventsDir = path.resolve(__dirname, 'public/images/events');
  if (!fs.existsSync(eventsDir)) {
    return [];
  }
  
  return fs.readdirSync(eventsDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map(file => `/images/events/${file}`);
}

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        // 追加ページがある場合はここに追加
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          eventImages: getEventImages(),
          buildTime: new Date().toISOString()
        }
      }
    })
  ],
  server: {
    port: 3010, // 天晴れ整体院専用のポート番号
    strictPort: false, // このポートが使用中なら次を探す
    open: true,
    host: true
  }
});