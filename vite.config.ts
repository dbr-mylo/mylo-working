
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create an array of plugins, conditionally including componentTagger only in development
  const plugins = [react()];
  
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
    },
  };
});
