import prisma from "../../../lib/prisma.ts";

export async function GET() {
  const startTime = Date.now();
  let dbStatus: "connected" | "disconnected" = "connected";
  let dbLatencyMs: number | null = null;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch {
    dbStatus = "disconnected";
  }

  const isHealthy = dbStatus === "connected";
  const statusCode = isHealthy ? 200 : 503;

  return Response.json(
    {
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
      durationMs: Date.now() - startTime,
    },
    { status: statusCode }
  );
}
