export type PostStatus = "Rascunho" | "Publicado" | "Agendado";

export interface Post {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  status: PostStatus;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  coverImage: string;
  videoYoutube: string;
  readingTime: string;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const KEY = "nicemp_cms_posts_v1";
const CAT_KEY = "nicemp_cms_categories_v1";

const SEED_CATEGORIES = ["Finanças", "Impostos", "Gestão", "Vendas"];

const SEED: Post[] = [
  {
    id: "1",
    title: "Como calcular ROI",
    subtitle: "Entenda retorno, lucro e decisão de investimento.",
    slug: "como-calcular-roi",
    category: "Finanças",
    status: "Publicado",
    tags: ["roi", "indicadores"],
    metaTitle: "Como calcular ROI | NICEMP",
    metaDescription: "Aprenda a calcular ROI e interpretar o retorno sobre investimento.",
    excerpt: "Aprenda a calcular o retorno sobre investimento do seu negócio.",
    content: `## O que é ROI?\n\nROI (Return on Investment) é uma métrica financeira que mede o retorno obtido em relação ao investimento realizado.\n\n## Fórmula\n\n\`\`\`\nROI (%) = ((Retorno - Investimento) ÷ Investimento) × 100\n\`\`\`\n\n## Exemplo prático\n\nSe você investiu R$ 1.000 e obteve R$ 1.500 de retorno:\n\n- Lucro = R$ 1.500 − R$ 1.000 = R$ 500\n- ROI = (500 ÷ 1.000) × 100 = **50%**`,
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
    tags: ["mei", "simples nacional"],
    metaTitle: "MEI ou Simples Nacional | NICEMP",
    metaDescription: "Veja diferenças entre MEI e Simples Nacional para pequenas empresas.",
    excerpt: "Descubra qual regime tributário pode fazer mais sentido.",
    content: `## MEI x Simples Nacional\n\nA escolha entre MEI e Simples Nacional depende do faturamento, da atividade e da estrutura da empresa.`,
    coverImage: "",
    videoYoutube: "",
    readingTime: "7 min",
    scheduledAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
];

// ─── Auto-publish scheduled posts ─────────────────────────────────────────────

function autoPublish(posts: Post[]): { posts: Post[]; changed: boolean } {
  const now = new Date().toISOString();
  let changed = false;
  const updated = posts.map((p) => {
    if (p.status === "Agendado" && p.scheduledAt && p.scheduledAt <= now) {
      changed = true;
      return { ...p, status: "Publicado" as PostStatus, publishedAt: p.scheduledAt, updatedAt: now };
    }
    return p;
  });
  return { posts: updated, changed };
}

// ─── Posts ────────────────────────────────────────────────────────────────────

function loadRaw(): Post[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Post[];
  } catch {
    return SEED;
  }
}

function persist(posts: Post[]): void {
  localStorage.setItem(KEY, JSON.stringify(posts));
}

export function loadPosts(): Post[] {
  const raw = loadRaw();
  const { posts, changed } = autoPublish(raw);
  if (changed) persist(posts);
  return posts;
}

export function getPost(id: string): Post | undefined {
  return loadPosts().find((p) => p.id === id);
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function savePost(post: Post): Post[] {
  const posts = loadRaw();
  const idx = posts.findIndex((p) => p.id === post.id);
  const updated = { ...post, updatedAt: new Date().toISOString() };
  if (idx >= 0) posts[idx] = updated;
  else posts.push(updated);
  persist(posts);
  return posts;
}

export function deletePost(id: string): Post[] {
  const posts = loadRaw().filter((p) => p.id !== id);
  persist(posts);
  return posts;
}

export function newPost(): Post {
  return {
    id: String(Date.now()),
    title: "",
    subtitle: "",
    slug: "",
    category: "",
    status: "Rascunho",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    excerpt: "",
    content: "",
    coverImage: "",
    videoYoutube: "",
    readingTime: "",
    scheduledAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: "",
  };
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CAT_KEY);
    if (!raw) {
      localStorage.setItem(CAT_KEY, JSON.stringify(SEED_CATEGORIES));
      return SEED_CATEGORIES;
    }
    return JSON.parse(raw) as string[];
  } catch {
    return SEED_CATEGORIES;
  }
}

export function saveCategories(cats: string[]): void {
  localStorage.setItem(CAT_KEY, JSON.stringify(cats));
}

export function addCategory(name: string): string[] {
  const cats = loadCategories();
  const trimmed = name.trim();
  if (!trimmed || cats.includes(trimmed)) return cats;
  const updated = [...cats, trimmed];
  saveCategories(updated);
  return updated;
}

export function removeCategory(name: string): string[] {
  const updated = loadCategories().filter((c) => c !== name);
  saveCategories(updated);
  return updated;
}
