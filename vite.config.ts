import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { localChatApiPlugin } from "./dev/localChatApiPlugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react(), localChatApiPlugin(env)],
    build: { cssCodeSplit: false },
  };
});
