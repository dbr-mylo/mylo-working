
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { PluginOption } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create an array of plugins, conditionally including componentTagger only in development
  const plugins: PluginOption[] = [react()];
  
  if (mode === 'development') {
    plugins.push(componentTagger());
  }
  
  return {
    server: {
      host: "localhost",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      // Add specific esbuild options to handle the multiple input files error
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'), // Simplified to direct path
        output: {
          // Ensure proper chunking
          manualChunks: undefined,
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        },
        external: ['https://cdn.gpteng.co/gptengineer.js'] // Keep external scripts
      },
    },
  };
});
