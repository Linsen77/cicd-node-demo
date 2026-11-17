/**
 * 最小“构建”步骤：不引入打包器，只做三件事
 * 1. 把 src/stats.js 复制到 dist/
 * 2. 生成 dist/build-info.json，记录本次构建对应的提交与 Node 版本
 * 3. 打印产物清单，方便在 Actions 日志里核对
 *
 * 生产项目里这一步会换成 vite build / tsc / esbuild，流程位置完全一样。
 */
import { mkdirSync, copyFileSync, writeFileSync, readdirSync } from 'node:fs';

const OUT_DIR = 'dist';

mkdirSync(OUT_DIR, { recursive: true });
copyFileSync('src/stats.js', `${OUT_DIR}/stats.js`);

// GitHub Actions 会注入 GITHUB_SHA；本地执行时取不到，就写 local
const commit = process.env.GITHUB_SHA ?? 'local';
const runId = process.env.GITHUB_RUN_ID ?? 'local';

writeFileSync(
  `${OUT_DIR}/build-info.json`,
  `${JSON.stringify(
    {
      commit,
      runId,
      node: process.version,
      builtAt: new Date().toISOString(),
    },
    null,
    2,
  )}\n`,
);

console.log('[build] 产物目录：', OUT_DIR);
console.log('[build] 对应提交：', commit);
console.log('[build] Node 版本：', process.version);
for (const file of readdirSync(OUT_DIR)) {
  console.log('[build] -', file);
}
