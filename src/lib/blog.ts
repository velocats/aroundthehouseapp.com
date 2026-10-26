import { getCollection } from 'astro:content';
import { isPublished } from '../../scripts/blog/schema.mjs';
export const publishedPosts = async () => (await getCollection('blog'))
  .filter(post => isPublished(post.data))
  .sort((a, b) => b.data.published.localeCompare(a.data.published) || a.slug.localeCompare(b.slug));
export const dateLabel = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
});
export const readingTime = (body: string) => Math.max(1, Math.ceil(body.split(/\s+/).length / 220));
export const postPath = (slug: string) => `/blog/${slug}/`;
