import { z } from 'zod';

export const categories = ['App tips', 'Home records', 'Maintenance', 'New homeowners'];
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(+parsed) && parsed.toISOString().slice(0, 10) === value;
}, 'Use a real calendar date in YYYY-MM-DD format');
const text = (max) => z.string().trim().min(1).max(max).refine(value => !/[<>\u0000-\u001f]/.test(value), 'Use plain text');
export const postSchema = z.object({
  title: text(100),
  description: text(180).refine(value => value.length >= 50, 'Use at least 50 characters'),
  author: text(80),
  category: z.enum(categories),
  published: date,
  updated: date.optional(),
  draft: z.boolean(),
  featuredImage: z.object({
    src: z.string().regex(/^\/blog\/images\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|png|jpg|jpeg)$/),
    alt: text(240)
  }).strict().optional()
}).strict().refine(post => !post.updated || post.updated >= post.published, {
  message: 'updated cannot precede published', path: ['updated']
});

// Future dates are held back until a build on or after that UTC date.
export const isPublished = (post, today = new Date().toISOString().slice(0, 10)) => !post.draft && post.published <= today;
