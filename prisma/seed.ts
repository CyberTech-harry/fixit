import { PrismaClient } from "@prisma/client";
import { CATEGORIES, TOPICS_DATA } from "../lib/topics-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clean existing records
  await prisma.comment.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.articleTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed default admin and demo user
  const adminUser = await prisma.user.create({
    data: {
      id: "user-admin",
      name: "IT Lead Administrator",
      email: "admin@itknowledgebase.io",
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      id: "user-demo",
      name: "Alex DevTech",
      email: "alex@techsupport.internal",
      role: "USER",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("Created users:", adminUser.email, demoUser.email);

  // Seed Categories
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const createdCat = await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap.set(cat.name, createdCat.id);
  }
  console.log(`Created ${CATEGORIES.length} categories.`);

  // Collect and seed unique tags
  const uniqueTags = new Set<string>();
  TOPICS_DATA.forEach((t) => t.tags.forEach((tag) => uniqueTags.add(tag)));

  const tagMap = new Map<string, string>();
  for (const tagName of Array.from(uniqueTags)) {
    const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const createdTag = await prisma.tag.create({
      data: {
        name: tagName,
        slug: tagSlug,
      },
    });
    tagMap.set(tagName, createdTag.id);
  }
  console.log(`Created ${uniqueTags.size} tags.`);

  // Seed Articles
  for (const topic of TOPICS_DATA) {
    const catId = categoryMap.get(topic.category) || CATEGORIES[0].id;

    const createdArticle = await prisma.article.create({
      data: {
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        summary: topic.summary,
        contentMdx: topic.details || topic.summary,
        categoryId: catId,
        difficulty: topic.difficulty,
        estimatedRead: topic.estimatedRead,
        videoUrl: topic.videoUrl,
        published: true,
        viewsCount: topic.viewsCount || 100,
      },
    });

    // Link Tags
    for (const tagName of topic.tags) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        await prisma.articleTag.create({
          data: {
            articleId: createdArticle.id,
            tagId: tagId,
          },
        });
      }
    }

    // Seed initial feedback
    if (topic.helpfulness) {
      await prisma.feedback.create({
        data: {
          articleId: createdArticle.id,
          userId: demoUser.id,
          isHelpful: true,
          comment: "Step-by-step instructions worked perfectly in production.",
        },
      });
    }
  }

  // Seed a sample discussion comment
  const firstArticle = TOPICS_DATA[0];
  if (firstArticle) {
    await prisma.comment.create({
      data: {
        content: "Pro-tip: You can also use Sysinternals Autoruns for even deeper startup analysis!",
        articleId: firstArticle.id,
        userId: adminUser.id,
      },
    });
  }

  console.log(`Successfully seeded ${TOPICS_DATA.length} articles with full relations!`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
