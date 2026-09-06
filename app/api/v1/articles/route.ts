import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TOPICS_DATA } from "@/lib/topics-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    try {
      const where: any = { published: true };
      if (category && category !== "all") {
        where.category = { slug: category };
      }
      if (difficulty && difficulty !== "all") {
        where.difficulty = difficulty.toUpperCase();
      }
      if (search) {
        where.OR = [
          { title: { contains: search } },
          { summary: { contains: search } },
        ];
      }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.article.count({ where }),
      ]);

      if (articles && articles.length > 0) {
        return NextResponse.json({
          articles,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        });
      }
    } catch (dbError) {
      // fallback to static
    }

    // Static fallback
    let filtered = TOPICS_DATA;
    if (category && category !== "all") {
      filtered = filtered.filter((t) => t.categorySlug === category);
    }
    if (difficulty && difficulty !== "all") {
      filtered = filtered.filter((t) => t.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      articles: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch articles" }, { status: 500 });
  }
}
