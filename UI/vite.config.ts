import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from "vite-bundle-analyzer";
import { getEnvVar } from "./src/utils/env";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), "VITE_");
  const enableAnalyzer = getEnvVar("VITE_ANALYZE")?.trim() === "true";

  return {
    plugins: [react(), ...(enableAnalyzer ? [analyzer()] : [])],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/vitest.setup.ts"],
      coverage: {
        reporter: ["text", "html", "json"],
        include: ["src/**/*.{ts,tsx}"],
        reportOnFailure: true,
        exclude: [
          "src/**/*.test.tsx",
          "src/**/*.test.ts",
          "src/vitest.setup.ts",
          "src/main.tsx",
          "src/App.tsx",
          "src/*.d.ts",
          "src/**/index.ts",
        ],
      },
    },
  };
});
