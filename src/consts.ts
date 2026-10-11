// 站点级常量。改这里即可统一修改全站信息。
//
// BASE：带尾部斜杠的站点基础路径。部署到 GitHub Pages 子路径（/仓库名）时，
// 所有内部链接与静态资源都必须以它开头，否则线上会 404。
export const BASE: string = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') + '/';

export const SITE_TITLE = '半栈手记';
export const SITE_DESCRIPTION = '一个技术笔记与生活随笔的混合博客 —— 用代码记录，也用文字生活。';
export const SITE_AUTHOR = 'fanta079';

// 导航项。category 用于分类页路由。
export const NAV_LINKS = [
  { label: '首页', href: '/' },
  { label: '技术', href: '/categories/tech' },
  { label: '生活', href: '/categories/life' },
  { label: '关于', href: '/about' },
];

// 分类的中文名与简介
export const CATEGORIES: Record<string, { label: string; description: string }> = {
  tech: { label: '技术', description: '工程实践、踩坑记录、源码阅读与工具链折腾。' },
  life: { label: '生活', description: '读书、旅行、随想 —— 代码之外的日常。' },
};
