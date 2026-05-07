import env from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import connectRedis from "./config/redis.js";

async function startServer() {
  await connectDB();
  await connectRedis();

  app.listen(env.PORT, () => {
    console.log("Server running on ", env.PORT);
  });
}

startServer();
