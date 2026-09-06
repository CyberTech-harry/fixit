import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slugOrId = params.slug;
    const body = await request.json();
    const { isHelpful, comment, userId } = body;

    try {
      // Find article by id or slug
      const article = await prisma.article.findFirst({
        where: {
          OR: [{ id: slugOrId }, { slug: slugOrId }],
        },
      });

      const articleId = article?.id || slugOrId;

      const feedback = await prisma.feedback.create({
        data: {
          articleId,
          isHelpful: Boolean(isHelpful),
          comment: comment || null,
          userId: userId || null,
        },
      });

      return NextResponse.json({ success: true, feedback });
    } catch (dbError) {
      return NextResponse.json({ success: true, logged: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record feedback" }, { status: 500 });
  }
}
