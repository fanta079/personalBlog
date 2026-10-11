---
title: 用 Astro + GitHub Actions 搭建个人博客
description: 从零开始，用 Astro 写 Markdown，靠 GitHub Actions 自动把站点部署到 GitHub Pages。
pubDate: 2026-10-11
category: tech
tags: [Astro, GitHub Pages, CI/CD]
draft: false
---

把这个博客跑起来其实只需要三步：写 Markdown、提交代码、让 Actions 帮你构建并发布。

## 为什么选 Astro

- **零运行时 JS**：默认输出纯静态 HTML，首屏快。
- **内容优先**：用 `content collections` 管理 Markdown，自带类型校验。
- **部署灵活**：构建产物就是 `dist/`，任何静态托管都能放。

## 关键配置

`astro.config.mjs` 里要让 GitHub Pages 正确解析资源路径：

```js
export default defineConfig({
  site: 'https://fanta079.github.io',
  base: '/personalBlog',
});
```

`set base` 之后，为了确保子路径部署下链接不会 404，站点用一个带尾斜杠的 `BASE` 常量（取自 `import.meta.env.BASE_URL`）统一给所有内部链接与静态资源加前缀。本地预览与线上访问都不会错位。

## 自动部署

`.github/workflows/deploy.yml` 在每次 push 到 `main` 时：

1. 用 `setup-node` 装依赖
2. `npm run build` 产出 `dist/`
3. `upload-pages-artifact` + `deploy-pages` 发布

只需在仓库 **Settings → Pages** 里把 Source 设为 **GitHub Actions**（设置一次即可），之后每次推送都会自动发布。

> 写完文章 `git push`，喝口水回来博客就更新了。
