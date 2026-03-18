/** @type {import("prettier").Config} */
export default {
  // 引入 Astro 插件
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  // 下面是常见的排版风格，你可以根据个人喜好修改
  semi: true, // 句尾添加分号
  singleQuote: true, // 使用单引号
  tabWidth: 2, // 缩进2个空格
  trailingComma: 'es5', // 尾随逗号
};
