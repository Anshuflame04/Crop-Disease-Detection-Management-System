import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Enable network access
    port: 5173, // Specify port
    strictPort: true, // Fail if port is in use
  },
  build: {
    outDir: 'dist', // Output directory for build (Netlify looks for this folder)
    rollupOptions: {
      output: {
        format: 'esm', // Output in ECMAScript module format
      },
    },
    target: 'esnext', // Set the build target for modern browsers
  },
  resolve: {
    alias: {
      // Only needed if you're using react-native-web
      'react-native$': 'react-native-web',
    },
  },
  base: '/', // This ensures correct asset loading in Netlify's deployment environment
});
