export const REPO_URL = "https://github.com/dkomeza/tisane.git";
export const CONTAINER_NAME = "prod_tisane";
export const IMAGE_NAME = "tisane-app";
export const HEALTHCHECK_URL = "http://app:3000/api/admin/healthcheck";
export const SUPERVISOR_PORT = 3001;
export const HEALTH_POLL_INTERVAL_MS = 2000;
export const HEALTH_POLL_MAX_ATTEMPTS = 30;
