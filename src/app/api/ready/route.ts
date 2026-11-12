import prisma from "../../../lib/prisma.ts";

export async function GET() {
  try {
    // Quick query to confirm database connection pool readiness
    await prisma.$queryRaw`SELECT 1`;
    return Response.json(
      {
        status: "ready",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        status: "not_ready",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
