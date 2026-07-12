import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

async function bootstrap(): Promise<void> {
  try {
    // Verify database connectivity
    await prisma.$connect();
    console.log("✅ Database connected successfully.");

    app.listen(env.PORT, () => {
      console.log(
        `🚀 TransitOps API running on http://localhost:${env.PORT} [${env.NODE_ENV}]`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

void bootstrap();
