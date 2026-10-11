# 半栈手记 · 个人博客模板

一个用 [Astro](https://astro.build) 构建、通过 **GitHub Actions** 自动部署到 **GitHub Pages** 的极简个人博客。

- 📝 用 Markdown 写文章，自动生成分类页与 RSS
- 🎨 极简技术风，自带深色模式（跟随系统）
- 🚀 push 到 `main` 即自动构建并发布
- 🧩 技术 / 生活双分类，导航与首页统计自动更新

> 默认配置对应 `github.com/fanta079/personalBlog`，线上地址 `https://fanta079.github.io/personalBlog`。**换成你自己的仓库时，记得改下面两处。**

---

## 1. 改成你自己的信息

打开 `astro.config.mjs`：

```js
const GITHUB_USER = 'fanta079';   // ← 改成你的 GitHub 用户名
const REPO_NAME   = 'personalBlog'; // ← 改成你的仓库名
```

再打开 `src/consts.ts`，修改：

- `SITE_TITLE` —— 站点标题
- `SITE_DESCRIPTION` —— 站点描述
- `SITE_AUTHOR` —— 作者名
- `NAV_LINKS` —— 顶部导航（如需增删）
- `CATEGORIES` —— 分类的中文名与简介

---

## 2. 写第一篇文章

在 `src/content/blog/` 下新建任意 `.md` 文件，格式如下：

```markdown
---
title: 文章标题
description: 一句话摘要（会显示在列表与 SEO 描述）
pubDate: 2026-10-11
category: tech          # tech 或 life
tags: [Astro, 前端]     # 可选
draft: false            # true 则不会被发布
---

正文用 Markdown 书写……
```

`category` 决定文章归到「技术」还是「生活」分类页；`draft: true` 的文章不会出现在站点中。

---

## 3. 本地预览

```bash
npm install
npm run dev      # 本地开发，默认 http://localhost:4321
npm run build    # 构建生产版本到 dist/
npm run preview  # 预览构建产物
```

> 本地因为有 `base: '/personalBlog'`，访问路径是 `http://localhost:4321/personalBlog/`。

---

## 4. 部署到 GitHub Pages

1. 把代码推到 GitHub 仓库（默认监听 `main` 分支）。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**（本仓库已配置好；把这个模板复制到新仓库时需手动设置一次）。
3. 之后每次 `git push` 到 `main`，工作流（`.github/workflows/deploy.yml`）会自动构建并发布。

首次部署后，稍等一两分钟，访问 `https://<你的用户名>.github.io/<仓库名>/` 即可看到博客。

---

## 目录结构

```
.
├── .github/workflows/deploy.yml   # 自动部署工作流
├── astro.config.mjs               # site / base 配置（必改）
├── src/
│   ├── consts.ts                  # 站点信息与导航（必改）
│   ├── content/blog/              # 你的 Markdown 文章
│   ├── components/                # Header / Footer / PostCard 等
│   ├── layouts/BaseLayout.astro   # 页面骨架
│   └── pages/                     # 首页 / 文章页 / 分类页 / RSS
└── public/favicon.svg
```

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发服务器 |
| `npm run build` | 构建到 `dist/` |
| `npm run preview` | 预览构建结果 |

> 关于依赖锁文件：依赖版本由 `package-lock.json` 锁定，CI 使用 `npm ci` 实现可复现构建。新增/升级依赖后，请在本地运行 `npm install` 并把更新后的 `package-lock.json` 一并提交，否则 CI 会因 `package.json` 与锁文件不一致而失败。
