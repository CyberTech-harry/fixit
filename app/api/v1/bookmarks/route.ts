import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, userId = "user-demo" } = body;

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    try {
      const existing = await prisma.bookmark.findUnique({
        where: {
          userId_articleId: {
            userId,
            articleId,
          },
        },
      });

      if (existing) {
        await prisma.bookmark.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ bookmarked: false });
      } else {
        await prisma.bookmark.create({
          data: {
            userId,
            articleId,
          },
        });
        return NextResponse.json({ bookmarked: true });
      }
    } catch (dbError) {
      return NextResponse.json({ bookmarked: true, fallback: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Bookmark operation failed" }, { status: 500 });
  }
}
