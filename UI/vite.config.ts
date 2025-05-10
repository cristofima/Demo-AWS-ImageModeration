import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { analyzer } from "vite-bundle-analyzer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const processEnv: { [key: string]: string } = {};
  for (const key in env) {
    if (key.startsWith("REACT_APP")) {
      processEnv[key] = env[key];
    }
  }

  return {
    define: {
      "process.env": processEnv,
    },
    plugins: [react(), analyzer()],
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
