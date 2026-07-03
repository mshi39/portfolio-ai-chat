interface WidgetRuntimeConfig {
  apiBaseUrl: string;
}

let runtimeConfig: WidgetRuntimeConfig = { apiBaseUrl: "" };

export function setWidgetRuntimeConfig(config: Partial<WidgetRuntimeConfig>): void {
  runtimeConfig = {
    ...runtimeConfig,
    ...config,
    apiBaseUrl: config.apiBaseUrl?.replace(/\/+$/, "") ?? runtimeConfig.apiBaseUrl,
  };
}

export function getChatApiUrl(): string {
  return runtimeConfig.apiBaseUrl
    ? `${runtimeConfig.apiBaseUrl}/api/chat`
    : "/api/chat";
}
