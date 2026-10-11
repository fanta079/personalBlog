# personalBlog 项目长期记忆

## 定位与地址
- Astro 个人博客模板，通过 GitHub Actions 自动构建并部署到 GitHub Pages。
- 仓库：`github.com/fanta079/personalBlog` · 线上：`https://fanta079.github.io/personalBlog/`

## 部署机制
- `push` 到 `main` 触发 `.github/workflows/deploy.yml`：checkout → setup-node(22, cache npm) → configure-pages → `npm ci` → `npm run build` → upload-pages-artifact → deploy-pages。
- Pages 已开启（`build_type=workflow`）。**新仓库需先开启**：`gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`，或 Settings → Pages → Source 选 GitHub Actions。

## 项目约定（改代码必须遵守）
- **所有内部链接与静态资源必须用 `src/consts.ts` 导出的 `BASE` 常量**（带尾斜杠），不要直接写 `/xxx`。原因：Astro 的 `base` 不自动改写 `<a href>`。
- 站点信息（标题/描述/作者/导航/分类）统一在 `src/consts.ts` 维护；`site`/`base` 在 `astro.config.mjs`。
- 文章放 `src/content/blog/*.md`，frontmatter：`title` / `description` / `pubDate` / `category: tech|life` / `tags[]` / `draft`。
- 依赖用 `package-lock.json` 锁定，CI 跑 `npm ci`；新增依赖后本地 `npm install` 并提交锁文件。

## 本机操作提示
- npm / build 需非沙箱执行（沙箱下 esbuild 报 EBUSY）。
- 推送（GCM 会卡住）：`git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main`
