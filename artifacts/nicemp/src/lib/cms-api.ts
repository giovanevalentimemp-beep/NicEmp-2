import type { Post, PostStatus } from "./cms-storage";

const BASE = "/api/cms";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`CMS API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export async function apiFetchPosts(): Promise<Post[]> {
  return request<Post[]>("/posts");
}

export async function apiSavePost(post: Post): Promise<Post> {
  return request<Post>(`/posts/${encodeURIComponent(post.id)}`, {
    method: "PUT",
    body: JSON.stringify(post),
  });
}

export async function apiDeletePost(id: string): Promise<void> {
  await request<void>(`/posts/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function apiFetchCategories(): Promise<string[]> {
  return request<string[]>("/categories");
}

export async function apiAddCategory(name: string): Promise<void> {
  await request<void>("/categories", { method: "POST", body: JSON.stringify({ name }) });
}

export async function apiDeleteCategory(name: string): Promise<void> {
  await request<void>(`/categories/${encodeURIComponent(name)}`, { method: "DELETE" });
}
