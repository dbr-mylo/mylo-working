
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
      outDir: 'dist', // Explicitly set the output directory
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'), // Simplified to a single entry point
        external: [
          // Mark external scripts that shouldn't be processed by Vite
          'https://cdn.gpteng.co/gptengineer.js'
        ]
      },
    },
  };
});
