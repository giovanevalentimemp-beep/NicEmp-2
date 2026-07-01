import { Router } from "express";
import { db } from "@workspace/db";
import { cmsPostsTable, cmsCategoriesTable, cmsPostViewsTable } from "@workspace/db";
import { eq, gte, sql } from "drizzle-orm";

const router = Router();

const SEED_CATEGORIES = ["Finanças", "Impostos", "Gestão", "Vendas"];

const SEED_POSTS = [
  {
    id: "1",
    title: "Como calcular ROI",
    subtitle: "Entenda retorno, lucro e decisão de investimento.",
    slug: "como-calcular-roi",
    category: "Finanças",
    status: "Publicado",
    tags: '["roi","indicadores"]',
    metaTitle: "Como calcular ROI | NICEMP",
    metaDescription: "Aprenda a calcular ROI e interpretar o retorno sobre investimento.",
    excerpt: "Aprenda a calcular o retorno sobre investimento do seu negócio.",
    content: `## O que é ROI?\n\nROI (Return on Investment) é uma métrica financeira que mede o retorno obtido em relação ao investimento realizado.\n\n## Fórmula\n\n\`\`\`\nROI (%) = ((Retorno - Investimento) ÷ Investimento) × 100\n\`\`\`\n\n## Exemplo prático\n\nSe você investiu R$ 1.000 e obteve R$ 1.500 de retorno:\n\n- Lucro = R$ 1.500 − R$ 1.000 = R$ 500\n- ROI = (500 ÷ 1.000) × 100 = **50%**\n\n## Interpretação\n\n- ROI > 50% → Excelente\n- ROI entre 20% e 50% → Bom\n- ROI < 20% → Baixo\n- ROI negativo → Prejuízo`,
    coverImage: "",
    videoYoutube: "",
    readingTime: "5 min",
    scheduledAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "MEI ou Simples Nacional",
    subtitle: "Compare regimes e veja pontos de atenção.",
    slug: "mei-ou-simples-nacional",
    category: "Impostos",
    status: "Publicado",
    tags: '["mei","simples nacional"]',
    metaTitle: "MEI ou Simples Nacional | NICEMP",
    metaDescription: "Veja diferenças entre MEI e Simples Nacional para pequenas empresas.",
    excerpt: "Descubra qual regime tributário pode fazer mais sentido.",
    content: `## MEI x Simples Nacional\n\nA escolha entre MEI e Simples Nacional depende do faturamento, da atividade e da estrutura da empresa.\n\n## MEI\n\n- Limite de faturamento: R$ 81.000/ano\n- Impostos fixos mensais (DAS-MEI)\n- Não pode ter sócios\n- Limitado a certas atividades\n\n## Simples Nacional\n\n- Limite de faturamento: R$ 4.800.000/ano\n- Alíquotas variáveis por faixa e anexo\n- Pode ter sócios\n- Abrange mais atividades\n\n## Quando migrar para o Simples?\n\nSe o seu faturamento anual se aproximar de R$ 81.000, é o momento de avaliar a migração.`,
    coverImage: "",
    videoYoutube: "",
    readingTime: "7 min",
    scheduledAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
];

function dbToPost(row: typeof cmsPostsTable.$inferSelect) {
  let tags: string[] = [];
  try { tags = JSON.parse(row.tags || "[]"); } catch { tags = []; }
  return {
    id: row.id, title: row.title, subtitle: row.subtitle, slug: row.slug,
    category: row.category, status: row.status as "Rascunho" | "Publicado" | "Agendado",
    tags, metaTitle: row.metaTitle, metaDescription: row.metaDescription,
    excerpt: row.excerpt, content: row.content, coverImage: row.coverImage,
    videoYoutube: row.videoYoutube, readingTime: row.readingTime,
    scheduledAt: row.scheduledAt, createdAt: row.createdAt,
    updatedAt: row.updatedAt, publishedAt: row.publishedAt,
  };
}

function postToDb(post: Record<string, unknown>) {
  return {
    id: String(post.id || Date.now()),
    title: String(post.title || ""),
    subtitle: String(post.subtitle || ""),
    slug: String(post.slug || ""),
    category: String(post.category || ""),
    status: String(post.status || "Rascunho"),
    tags: JSON.stringify(Array.isArray(post.tags) ? post.tags : []),
    metaTitle: String(post.metaTitle || ""),
    metaDescription: String(post.metaDescription || ""),
    excerpt: String(post.excerpt || ""),
    content: String(post.content || ""),
    coverImage: String(post.coverImage || ""),
    videoYoutube: String(post.videoYoutube || ""),
    readingTime: String(post.readingTime || ""),
    scheduledAt: String(post.scheduledAt || ""),
    createdAt: String(post.createdAt || new Date().toISOString()),
    updatedAt: new Date().toISOString(),
    publishedAt: String(post.publishedAt || ""),
  };
}

async function autoPublishScheduled() {
  try {
    const now = new Date().toISOString();
    const scheduled = await db.select().from(cmsPostsTable).where(eq(cmsPostsTable.status, "Agendado"));
    for (const post of scheduled) {
      if (post.scheduledAt && post.scheduledAt <= now) {
        await db.update(cmsPostsTable)
          .set({ status: "Publicado", publishedAt: post.scheduledAt, updatedAt: now })
          .where(eq(cmsPostsTable.id, post.id));
      }
    }
  } catch { /* no-op */ }
}

async function seedIfEmpty() {
  try {
    const existing = await db.select().from(cmsPostsTable);
    if (existing.length === 0) {
      await db.insert(cmsPostsTable).values(SEED_POSTS);
    }
    const cats = await db.select().from(cmsCategoriesTable);
    if (cats.length === 0) {
      await db.insert(cmsCategoriesTable).values(SEED_CATEGORIES.map((n) => ({ name: n })));
    }
  } catch { /* no-op */ }
}

// ─── Posts ────────────────────────────────────────────────────────────────────

router.get("/cms/posts", async (_req, res) => {
  try {
    await seedIfEmpty();
    await autoPublishScheduled();
    const rows = await db.select().from(cmsPostsTable);
    res.json(rows.map(dbToPost));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.put("/cms/posts/:id", async (req, res) => {
  try {
    const row = postToDb({ ...req.body, id: req.params.id });
    await db.insert(cmsPostsTable).values(row).onConflictDoUpdate({
      target: cmsPostsTable.id,
      set: { ...row },
    });
    res.json(dbToPost(row as typeof cmsPostsTable.$inferSelect));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.delete("/cms/posts/:id", async (req, res) => {
  try {
    await db.delete(cmsPostViewsTable).where(eq(cmsPostViewsTable.postId, req.params.id));
    await db.delete(cmsPostsTable).where(eq(cmsPostsTable.id, req.params.id));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ─── View tracking ────────────────────────────────────────────────────────────

router.post("/cms/posts/:id/view", async (req, res) => {
  try {
    await db.insert(cmsPostViewsTable).values({
      id: `${req.params.id}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      postId: req.params.id,
      viewedAt: new Date().toISOString(),
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ─── Analytics ────────────────────────────────────────────────────────────────

router.get("/cms/analytics", async (_req, res) => {
  try {
    await seedIfEmpty();

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    // All time totals per post
    const allTimeCounts = await db
      .select({
        postId: cmsPostViewsTable.postId,
        views: sql<number>`cast(count(*) as int)`,
      })
      .from(cmsPostViewsTable)
      .groupBy(cmsPostViewsTable.postId);

    // Today counts per post
    const todayCounts = await db
      .select({
        postId: cmsPostViewsTable.postId,
        views: sql<number>`cast(count(*) as int)`,
      })
      .from(cmsPostViewsTable)
      .where(gte(cmsPostViewsTable.viewedAt, todayStart.toISOString()))
      .groupBy(cmsPostViewsTable.postId);

    // Last 7 days counts per post
    const weekCounts = await db
      .select({
        postId: cmsPostViewsTable.postId,
        views: sql<number>`cast(count(*) as int)`,
      })
      .from(cmsPostViewsTable)
      .where(gte(cmsPostViewsTable.viewedAt, weekStart.toISOString()))
      .groupBy(cmsPostViewsTable.postId);

    // Views by day (last 7 days)
    const allViews = await db
      .select({ viewedAt: cmsPostViewsTable.viewedAt })
      .from(cmsPostViewsTable)
      .where(gte(cmsPostViewsTable.viewedAt, weekStart.toISOString()));

    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const v of allViews) {
      const day = v.viewedAt.slice(0, 10);
      if (day in dayMap) dayMap[day]++;
    }
    const viewsByDay = Object.entries(dayMap).map(([date, views]) => ({ date, views }));

    // Get posts to enrich top posts with titles/slugs
    const posts = await db.select().from(cmsPostsTable);
    const postMap = new Map(posts.map((p) => [p.id, p]));

    const todayMap = new Map(todayCounts.map((r) => [r.postId, r.views]));
    const weekMap  = new Map(weekCounts.map((r)  => [r.postId, r.views]));

    const topPosts = allTimeCounts
      .sort((a, b) => b.views - a.views)
      .slice(0, 7)
      .map((r) => ({
        postId: r.postId,
        title: postMap.get(r.postId)?.title ?? "Artigo removido",
        slug: postMap.get(r.postId)?.slug ?? "",
        views: r.views,
        viewsToday: todayMap.get(r.postId) ?? 0,
        viewsLast7Days: weekMap.get(r.postId) ?? 0,
      }));

    const totalViews = allTimeCounts.reduce((s, r) => s + r.views, 0);
    const viewsToday = todayCounts.reduce((s, r) => s + r.views, 0);
    const viewsLast7Days = weekCounts.reduce((s, r) => s + r.views, 0);

    res.json({ totalViews, viewsToday, viewsLast7Days, topPosts, viewsByDay });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ─── Categories ───────────────────────────────────────────────────────────────

router.get("/cms/categories", async (_req, res) => {
  try {
    await seedIfEmpty();
    const rows = await db.select().from(cmsCategoriesTable);
    res.json(rows.map((r) => r.name));
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post("/cms/categories", async (req, res): Promise<void> => {
  try {
    const { name } = req.body as { name: string };

    if (!name?.trim()) {
      res.status(400).json({ error: "Name required" });
      return;
    }

    await db
      .insert(cmsCategoriesTable)
      .values({ name: name.trim() })
      .onConflictDoUpdate({
        target: cmsCategoriesTable.name,
        set: { name: name.trim() },
      });

    res.json({ name: name.trim() });
    return;

  } catch (err) {
    res.status(500).json({ error: String(err) });
    return;
  }
});

router.delete("/cms/categories/:name", async (req, res) => {
  try {
    await db.delete(cmsCategoriesTable).where(eq(cmsCategoriesTable.name, decodeURIComponent(req.params.name)));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
