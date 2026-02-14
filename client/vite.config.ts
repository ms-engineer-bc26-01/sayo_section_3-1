// client/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // Docker 内からアクセス可能にする
    watch: {
      usePolling: true, // ファイル変更をポーリングで監視
      interval: 100     // 監視間隔(ms)
    }
  }
});
