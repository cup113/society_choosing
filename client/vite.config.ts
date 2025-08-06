import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import vueDevTools from 'vite-plugin-vue-devtools'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:4127',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vue": ["vue", "vue-router", "@vueuse/core", "pinia"],
          "ui": ["@tanstack/vue-table", "lucide-vue-next", "clsx", "radix-vue", "reka-ui", "vaul-vue"],
          "dashboard": [
            './src/views/DashboardView.vue',
            './src/stores/admission.ts',
          ],
          "admin": [
            './src/views/AdminView.vue',
            './src/views/AdminUserManagement.vue',
            './src/views/AdminDateManagement.vue',
            './src/views/AdminSocietyManagement.vue',
            './src/stores/admin.ts',
          ],
        },
      }
    }
  },
})
