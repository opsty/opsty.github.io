import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 1. 展开 Astro 官方推荐的扁平化配置
  ...eslintPluginAstro.configs.recommended,

  // 2. 引入 Prettier 配置，用来关闭所有会和 Prettier 冲突的 ESLint 规则
  // 注意：这个一定要放在数组的最后！
  eslintConfigPrettier,

  // 3. 如果你有自己想加的自定义规则，可以写在下面这个对象里
  {
    rules: {
      // 比如：禁止使用 console.log (生产环境常开)
      // "no-console": "warn"
    }
  }
];