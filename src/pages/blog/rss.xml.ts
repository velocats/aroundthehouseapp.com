import { publishedPosts, postPath } from '../../lib/blog';
const escape = (text: string) => text.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);
export async function GET({ site }) {
  const posts = await publishedPosts();
  const feed = new URL('/blog/rss.xml', site).href;
  const items = posts.map(post => {
    const url = new URL(postPath(post.slug), site).href;
    return `<item><title>${escape(post.data.title)}</title><description>${escape(post.data.description)}</description><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${post.data.published}T00:00:00Z`).toUTCString()}</pubDate><category>${escape(post.data.category)}</category><dc:creator>${escape(post.data.author)}</dc:creator></item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Around the House blog</title><link>${new URL('/blog/', site).href}</link><description>Practical ideas for home records and maintenance.</description><language>en-us</language><atom:link href="${feed}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
