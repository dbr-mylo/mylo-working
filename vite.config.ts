
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
      rollupOptions: {
        // Use a single entry point to avoid multiple input files error
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        // External scripts that shouldn't be processed by Vite
        external: ['https://cdn.gpteng.co/gptengineer.js']
      },
    },
  };
});
