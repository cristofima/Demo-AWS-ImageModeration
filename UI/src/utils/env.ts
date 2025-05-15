// Add this type declaration if not already present globally
interface ImportMeta {
  env: Record<string, string>;
}

// Declare window.ENV for TypeScript
declare global {
  // Use globalThis for universal context
  // eslint-disable-next-line no-var
  var ENV: Record<string, string> | undefined;
}

// Utility to get env vars from VITE_ or runtime-injected window.ENV
export function getEnvVar(key: string): string | undefined {
  // Prefer runtime-injected env (from Docker entrypoint)
  if (
    typeof globalThis !== "undefined" &&
    (globalThis as any).ENV &&
    (globalThis as any).ENV[key]
  ) {
    return (globalThis as any).ENV[key];
  }
  // Fallback to Vite env
  const viteEnv = (import.meta as unknown as ImportMeta).env;
  if (viteEnv && key in viteEnv) {
    return viteEnv[key];
  }
  // Fallback to process.env (for test environments)
  if (typeof process !== "undefined" && process.env && key in process.env) {
    return process.env[key];
  }
  return undefined;
}
