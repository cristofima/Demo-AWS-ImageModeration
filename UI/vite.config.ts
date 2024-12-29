import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv: { [key: string]: string } = {};
  for (const key in env) {
    if (key.startsWith('REACT_APP')) {
      processEnv[key] = env[key];
    }
  }

  return {
    define: {
      'process.env': processEnv
    },
    plugins: [react()],
  }
});
