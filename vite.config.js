import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },

  server: {
    proxy: {
      '/api': {
        target: 'resonancia-backend-production.up.railway.app', // URL de tu backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
