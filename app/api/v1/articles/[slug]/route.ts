import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTopicBySlug } from "@/lib/topics-data";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    try {
      const article = await prisma.article.findUnique({
        where: { slug },
        include: {
          category: true,
          tags: { include: { tag: true } },
          comments: {
            include: { user: true },
            orderBy: { createdAt: "desc" },
          },
          feedback: true,
        },
      });

      if (article) {
        prisma.article.update({
          where: { id: article.id },
          data: { viewsCount: { increment: 1 } },
        }).catch(() => {});

        return NextResponse.json({ article });
      }
    } catch (dbError) {
      // fallback
    }

    const staticTopic = getTopicBySlug(slug);
    if (staticTopic) {
      return NextResponse.json({ article: staticTopic });
    }

    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
