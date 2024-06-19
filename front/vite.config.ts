import { execSync } from "child_process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      svgr(),
      react({
        babel: {
          plugins: [["babel-plugin-styled-components", { displayName: true }]]
        }
      }),
      tsconfigPaths()
    ],
    server: {
      port: 41001,
      proxy: {
        "/api": {
          target: env.API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        },
      }
    },
    define: {
      __ENV__: JSON.stringify(env.NODE_ENV)
    },
    build: {
      chunkSizeWarningLimit: 300,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom/client"],
            vendors: ["axios", "mobx", "mobx-react-lite"],
            "styled-components": ["styled-components"],
            "quark-icons": ["@quark-uilib/icons"],
            "quark-components": ["@quark-uilib/components"]
          }
        }
      }
    }
  };
});
