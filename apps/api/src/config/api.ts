export interface IApiConfig {
  port: number;
}

const getEnvVar = (name: string) => {
  const val = process.env[name];
  if (!val) {
    throw new Error(`Missing ${name} env var`);
  }
  return val;
};

export const apiConfig = (): IApiConfig => {
  return {
    port: Number(getEnvVar('PORT')),
  };
};
