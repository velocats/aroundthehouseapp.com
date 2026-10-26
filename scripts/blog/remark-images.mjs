import { readFileSync } from 'node:fs';
import { imageSize } from 'image-size';
// The blog validator restricts images to local rasters; drafts stay outside public/.
export default function blogImageDimensions() {
  return tree => {
    function walk(node) {
      if (node.type === 'image' && node.url.startsWith('/blog/images/')) {
        const { width, height } = imageSize(readFileSync(new URL(`../../src/content/blog-images/${node.url.slice('/blog/images/'.length)}`, import.meta.url)));
        node.data = { ...node.data, hProperties: { width, height, loading: 'lazy', decoding: 'async' } };
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}
