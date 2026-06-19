// app/health/route.ts
// Simple health check endpoint for Docker and nginx
// Returns 200 OK with basic status info

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "silverbank-frontend",
    timestamp: new Date().toISOString(),
  });
}
