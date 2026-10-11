import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 所有文章放在 src/content/blog/ 下，用 frontmatter 里的 category 区分「技术 / 生活」。
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['tech', 'life']),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
