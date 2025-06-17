export interface IDatabaseConfig {
  host: string;
  name: string;
  username: string;
  password: string;
  type: string;
  port: number;
}

const getEnvVar = (name: string) => {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing ${name} env var`);
  }
  return val;
};

export const databaseConfig = (): IDatabaseConfig => {
  return {
    host: getEnvVar('DB_HOST'),
    name: getEnvVar('DB_NAME'),
    username: getEnvVar('DB_USERNAME'),
    password: getEnvVar('DB_PASSWORD'),
    type: getEnvVar('DB_TYPE'),
    port: Number(getEnvVar('DB_PORT')) || 1433,
  };
};
