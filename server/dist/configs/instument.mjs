import * as Sentry from "@sentry/node"



Sentry.init({
  dsn: "https://25bc3759b0fc7e741231d4556ad28d79@o4510899563003904.ingest.de.sentry.io/4510899604422736",
  // Tracing must be enabled for MCP monitoring to work
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});