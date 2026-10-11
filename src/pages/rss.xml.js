import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_AUTHOR, BASE } from '../consts';

export async function GET(context) {
  const site = context.site ?? new URL('https://fanta079.github.io/personalBlog/');
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = posts
    .map((post) => {
      const url = new URL(BASE + `posts/${post.id}/`, site).href;
      const date = post.data.pubDate.toUTCString();
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(post.data.description)}</description>
      <category>${post.data.category}</category>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${new URL(BASE, site).href}</link>
    <atom:link href="${new URL(BASE + 'rss.xml', site).href}" rel="self" type="application/rss+xml" />
    <description>${SITE_DESCRIPTION}</description>
    <language>zh-CN</language>
    <managingEditor>${SITE_AUTHOR}</managingEditor>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
