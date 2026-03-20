---
title: CSS_Basic
categories: WEB
author: GGLG
description: 'CSS, style, 常用语法, sheet, grammar, fundamental, basic'
pubDate: 2026-03-21
---

## <center>CSS_Basic

### [语法结构]

#### [style基本结构]

```css
选择器 {
  属性: 值;
  属性: 值;
}
```

#### [选择器]

```markdown
元素 选择器 (HTML元素作为选择器)
语法: HTML元素 {}
```

```markdown
id 选择器 (只能在唯一的HTML元素中使用):
语法: #选择器名称 {}
```

```markdown
class 选择器 (可在多元素中使用):
语法: .选择器名称 {}
```

```markdown
全局 选择器 (针对所有应用页面的HTML元素)
语法: \* {}
```

#### [装载CSS]

```markdown
外部 装载
语法: <link rel="stylesheet" herf="CSS文件路径">
```

```markdown
内部 装载
语法: <head>
<style>
CSS 内容
</style>
</head>
```

```markdown
行内 装载
语法: <HTML元素 style="">
以属元素属性方式装载CSS
</HTML元素>
```

#### [CSS装载优先级]

```markdown
行内装载 > 外部和内部装载 > 浏览器默认
```
