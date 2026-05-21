import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "PORT",
  "MONGODB_URI",
  "REDIS_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "SMTP_EMAIL",
  "SMTP_PASSWORD",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const env = Object.freeze({
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  REDIS_URL: process.env.REDIS_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

export default env;
