require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const redis = require("./src/config/redis");
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await redis.ping();
console.log("Redis connection verified!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
};

startServer();