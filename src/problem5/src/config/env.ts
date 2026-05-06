import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

requireEnv("DATABASE_URL");

export const env = {
  port: Number(process.env.PORT) || 3000,
};
