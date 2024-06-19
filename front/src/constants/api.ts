export const API_SOURCE =
  location.protocol +
  "//" +
  location.hostname +
  (location.port ? ":" + location.port : "");

export const WS_SOURCE = `ws${location.protocol.replace("http", "")}//${
  location.hostname
}${location.port ? `:${location.port}` : ""}`;

export const TIMEOUT_API = 30000;
