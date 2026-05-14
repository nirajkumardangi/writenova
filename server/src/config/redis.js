import { createClient } from "redis";
import env from "./env.js";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

export const redis = {
  async get(key) {
    return redisClient.get(key);
  },

  async set(key, value, options = {}) {
    return redisClient.set(key, value, options);
  },

  async del(key) {
    return redisClient.del(key);
  },
};

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis Connected ✅");
  } catch (error) {
    console.error("Redis Connection Failed ❌");
    console.error(error.message);

    process.exit(1);
  }
};

export default connectRedis;
