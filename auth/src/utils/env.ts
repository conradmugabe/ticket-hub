const AUTH_PREFIX = 'AUTH_';
const ENV_VARIABLES = [`${AUTH_PREFIX}JWT_KEY`, `${AUTH_PREFIX}MONGO_URI`];

export function checkEnvironmentVariables() {
  ENV_VARIABLES.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });
}
