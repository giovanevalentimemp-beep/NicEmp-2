---
name: CMS persistence
description: How CMS posts/categories are stored and fetched
---
Posts and categories live in PostgreSQL (cms_posts, cms_categories tables via Drizzle).
The API server (port 8080) exposes /api/cms/posts and /api/cms/categories.
The frontend fetches from the API on mount; localStorage is the immediate fallback.
Auto-publish of scheduled posts happens server-side on GET /api/cms/posts.
Seed data (2 posts, 4 categories) is inserted automatically when tables are empty.
**Why:** localStorage is device-local; users couldn't see posts on other devices/browsers.
**How to apply:** Always save posts via apiSavePost() + savePost() (local); read via apiFetchPosts() with loadPosts() fallback.
