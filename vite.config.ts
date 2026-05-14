import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages repository path: https://<user>.github.io/ai-prompt-studio/
  base: "/ai-prompt-studio/",
});
