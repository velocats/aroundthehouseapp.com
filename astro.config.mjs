import { defineConfig } from 'astro/config';
import blogImageDimensions from './scripts/blog/remark-images.mjs';

export default defineConfig({
  site: 'https://aroundthehouseapp.com',
  markdown: { remarkPlugins: [blogImageDimensions] }
});
