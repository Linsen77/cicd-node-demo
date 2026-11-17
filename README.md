# cicd-node-demo

CI/CD 课程实验二：一个能跑的最小 Node 项目，用来演示 `lint → test → build` 三阶段流水线。

## 项目结构

```
cicd-node-demo/
├─ src/stats.js              # 业务代码：求和 / 平均值 / 最大值 / 分数等级
├─ tests/stats.test.js       # 单元测试（node --test），含错误入参与边界值
├─ scripts/build.js          # 最小构建：复制产物 + 生成 build-info.json
├─ eslint.config.js          # ESLint 9 扁平配置
├─ .github/workflows/
│  ├─ hello.yml              # 6.1 最小工作流
│  └─ ci.yml                 # 6.2 Node.js CI
├─ package.json
└─ package-lock.json         # npm ci 依赖它，必须提交
```

## 本地先跑通（CI 只是在另一台机器上重复这三条命令）

```bash
npm ci          # 按锁文件安装依赖
npm run lint    # 代码规范检查
npm test        # 单元测试
npm run build   # 生成 dist/
```

三条命令全绿，再去配 CI。本地就红的话，CI 一定也红，且更难排查。

## 推送与运行

```bash
git remote add origin https://github.com/Linsen77/cicd-node-demo.git
git push -u origin main
```

推送后到 **Actions** 会看到两个工作流：
- `Hello World CI`：三个 step（echo / date / ls -l）。注意它没有 checkout，所以 `ls -l` 看到的是空目录。
- `Node.js CI`：Checkout → Setup Node 22 → `npm ci` → lint → test → build → 上传 dist 产物。

## 故障演练（实验二的得分点，必须做一遍）

**演练 A：让 Lint 失败**

1. 在 `src/stats.js` 末尾加一行 `const unused = 1;`（定义了但没用）。
2. 提交推送。
3. 预期：`Lint` 步骤变红，报 `'unused' is assigned a value but never used`；`Test` 和 `Build` **不执行**。
4. 删掉这行，重新提交，确认变绿。

**演练 B：让测试失败（不是让 lint 失败）**

1. 把 `src/stats.js` 里 `average` 的 `Math.round(value * 100) / 100` 改成 `value`。
2. 提交推送。
3. 预期：`Lint` 通过、`Test` 变红，报断言差异（`1.6666666666666667 !== 1.67`）；`Build` 不执行。
4. 改回原样，重新提交，确认变绿。

**关键认知**：修复必须改代码，不能靠删测试、放宽断言、加 `--passWithNoTests` 来让它变绿。

## 与报告模板的差异说明（填报告时按实际写）

| 报告模板 | 本项目实际 | 原因 |
| --- | --- | --- |
| `node-version: 20` | `'22'` | 本机 Node 22.22.2，统一版本避免本地/CI 行为不一致 |
| `npm test -- --ci` | `npm test` | `--ci` 是 Jest 参数；本项目用 Node 内置测试器 |
| `npm run lint && npm test -- --ci`（单行） | 拆成独立 step | 拆分后日志能精确定位是 lint 还是 test 失败 |
| 无制品上传 | `upload-artifact@v4` | 把 dist 留存，便于核对本次构建文件 |

## 常见坑

- **`npm ci` 报 `Missing: ... from lock file`**：`package.json` 改过但没同步锁文件 → 本地跑 `npm install` 重新生成后提交。
- **`npm ci` 报 `npm ci can only install with an existing package-lock.json`**：锁文件被 `.gitignore` 掉了或没提交。
- **Lint 在本地通过、CI 失败**：多半是 `dist/` 被一起 lint 了，或本地有未提交的配置改动。
- **缓存命中不等于通过**：`cache: 'npm'` 只缓存下载的包，`npm ci` 仍然会真实执行。
- **`node --test tests/` 找不到用例**：文件名必须是 `*.test.js`，或改用 `node --test`（自动发现）。
