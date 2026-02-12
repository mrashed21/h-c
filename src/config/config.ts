import dotenv from "dotenv";
dotenv.config();

interface IConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
}

const requiredEnv = [
  "NODE_ENV",
  "PORT",
  "DATABASE_URL",
  "BETTER_AUTH_URL",
  "BETTER_AUTH_SECRET",
];

requiredEnv.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

export const config: IConfig = {
  NODE_ENV: process.env.NODE_ENV!,
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
};
