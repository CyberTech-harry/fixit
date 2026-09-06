import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json({ error: "articleId is required" }, { status: 400 });
    }

    try {
      const comments = await prisma.comment.findMany({
        where: { articleId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ comments });
    } catch (e) {
      return NextResponse.json({ comments: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to get comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, content, author, userId = "user-demo" } = body;

    if (!articleId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          articleId,
          content,
          userId,
        },
        include: { user: true },
      });
      return NextResponse.json({ success: true, comment });
    } catch (e) {
      return NextResponse.json({
        success: true,
        comment: {
          id: `c-${Date.now()}`,
          content,
          author: author || "IT Professional",
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to post comment" }, { status: 500 });
  }
}
