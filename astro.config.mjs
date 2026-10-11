// @ts-check
import { defineConfig } from 'astro/config';

// 部署到 GitHub Pages 时需要设置 site 与 base。
// 规则：
//   site = "https://<用户名>.github.io"
//   base = "/<仓库名>"
// 本模板默认对应 https://github.com/fanta079/personalBlog
// 如果你 fork/克隆到自己的账号，请改成自己的用户名与仓库名。
const GITHUB_USER = 'fanta079';
const REPO_NAME = 'personalBlog';

export default defineConfig({
  site: `https://${GITHUB_USER}.github.io`,
  base: `/${REPO_NAME}`,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
