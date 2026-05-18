import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const _config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  EMAIL_USER: process.env.EMAIL_USER,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
};

export default Object.freeze(_config);
