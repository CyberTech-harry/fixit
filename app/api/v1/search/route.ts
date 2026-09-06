import { NextRequest, NextResponse } from "next/server";
import { searchTopics } from "@/lib/topics-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "all";
    const difficulty = searchParams.get("difficulty") || "all";

    const results = searchTopics(query, category, difficulty);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      results: results.slice(0, 30),
      total: results.length,
      latencyMs: `${latencyMs}ms`,
      query,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
