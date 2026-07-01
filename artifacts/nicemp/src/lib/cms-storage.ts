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

const SEED_CATEGORIES = ["Financas", "Impostos", "Gestao", "Vendas"];

const SEED: Post[] = [
  {
    id: "1",
    title: "Como calcular ROI",
    subtitle: "Entenda retorno, lucro e decisão de investimento.",
    slug: "como-calcular-roi",
    category: "Financas",
    status: "Publicado",
    tags: ["roi", "indicadores"],
    metaTitle: "Como calcular ROI | NICEMP",
    metaDescription: "Aprenda a calcular ROI e interpretar o retorno sobre investimento.",
    excerpt: "Aprenda a calcular o retorno sobre investimento do seu negócio.",
    content: `## O que é ROI?

ROI (Return on Investment) é uma métrica financeira que mede o retorno obtido em relação ao investimento realizado.

## Fórmula

\`\`\`
ROI (%) = ((Retorno - Investimento) ÷ Investimento) × 100
\`\`\`

## Exemplo prático

Se você investiu R$ 1.000 e obteve R$ 1.500 de retorno:

- Lucro = R$ 1.500 − R$ 1.000 = R$ 500
- ROI = (500 ÷ 1.000) × 100 = **50%**

## Interpretação

- ROI > 50% → Excelente
- ROI entre 20% e 50% → Bom
- ROI < 20% → Baixo
- ROI negativo → Prejuízo`,
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
    content: `## MEI x Simples Nacional

A escolha entre MEI e Simples Nacional depende do faturamento, da atividade e da estrutura da empresa.

## MEI

- Limite de faturamento: R$ 81.000/ano
- Impostos fixos mensais (DAS-MEI)
- Não pode ter sócios
- Limitado a certas atividades

## Simples Nacional

- Limite de faturamento: R$ 4.800.000/ano
- Alíquotas variáveis por faixa e anexo
- Pode ter sócios
- Abrange mais atividades

## Quando migrar para o Simples?

Se o seu faturamento anual se aproximar de R$ 81.000, é o momento de avaliar a migração. O Simples Nacional oferece mais flexibilidade e capacidade de crescimento.`,
    coverImage: "",
    videoYoutube: "",
    readingTime: "7 min",
    scheduledAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Como precificar produtos",
    subtitle: "Use markup e margem com mais clareza.",
    slug: "como-precificar-produtos",
    category: "Vendas",
    status: "Rascunho",
    tags: ["markup", "preco"],
    metaTitle: "Como precificar produtos | NICEMP",
    metaDescription: "Aprenda a calcular preço de venda com custos, despesas e margem.",
    excerpt: "Calcule margem de lucro e markup sem complicação.",
    content: "",
    coverImage: "",
    videoYoutube: "",
    readingTime: "6 min",
    scheduledAt: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: "",
  },
];

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
  return loadRaw();
}

export function getPost(id: string): Post | undefined {
  return loadRaw().find((p) => p.id === id);
}

export function getPostBySlug(slug: string): Post | undefined {
  return loadRaw().find((p) => p.slug === slug);
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
