// ESLint 9 的扁平配置（flat config）。CI 里执行 npm run lint 走的就是这份规则。
import js from '@eslint/js';

export default [
  // 官方推荐规则集：会检查未使用变量、未定义变量、可疑写法等
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        // Node 内置全局对象，避免 no-undef 误报
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      // 演示用：把这两条显式写出来，方便做“故意写错 → CI 变红”的演练
      'no-unused-vars': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  {
    // 构建产物和依赖目录不参与代码规范检查
    ignores: ['dist/**', 'node_modules/**'],
  },
];
