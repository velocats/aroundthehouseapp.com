import { defineCollection } from 'astro:content';
import { postSchema } from '../../scripts/blog/schema.mjs';
export const collections = { blog: defineCollection({ type: 'content', schema: postSchema }) };
