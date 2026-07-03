import React from "react";
import { createRoot } from "react-dom/client";
import { ChatWidget } from "./components/chat/ChatWidget";
import { setWidgetRuntimeConfig } from "./config/widgetRuntime";
import widgetStyles from "./styles/globals.css?inline";

const HOST_ID = "melissa-portfolio-chat";
const loaderScript = document.currentScript as HTMLScriptElement | null;

function mountWidget(): void {
  if (document.getElementById(HOST_ID)) return;

  const scriptOrigin = loaderScript?.src
    ? new URL(loaderScript.src, window.location.href).origin
    : "";
  setWidgetRuntimeConfig({
    apiBaseUrl: loaderScript?.dataset.apiBase ?? scriptOrigin,
  });

  const host = document.createElement("div");
  host.id = HOST_ID;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;";
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `${widgetStyles}\n:host { font-family: "Open Sans", ui-sans-serif, system-ui, sans-serif; color: #0a1823; }`;
  const mountPoint = document.createElement("div");
  shadowRoot.append(style, mountPoint);

  createRoot(mountPoint).render(
    <React.StrictMode>
      <ChatWidget />
    </React.StrictMode>,
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountWidget, { once: true });
} else {
  mountWidget();
}
