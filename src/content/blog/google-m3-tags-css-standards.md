---
title: Google Material Design 3 (M3) 常用标签及 CSS 标准
date: 2023-10-27 10:00:00
author: DDLG
description: "Material Design 3M3 CSS 前端开发"
pubDate: 2026-03-21
---

## 引言

Google Material Design 3 (M3) 是 Google 最新的设计系统，它提供了一套全面的指南和组件，帮助开发者构建美观、现代且用户友好的应用程序。M3 在 Material Design 2 的基础上进行了诸多改进，引入了动态配色、更灵活的布局和全新的组件。

本文将详细介绍 Google Material Design 3 中常用标签的使用方法，并深入探讨其相关的 CSS 标准，包括圆角、阴影、边距等，帮助开发者更好地理解和应用 M3 设计规范。

## 对话框 (Dialog)

对话框是 M3 中常用的组件之一，用于向用户显示重要信息或请求用户进行决策。在 Material Web 中，对话框通常使用 `<md-dialog>` 标签表示。

### CSS 标准

#### 圆角 (Border-radius)

根据 Material Web 的实现，对话框容器的圆角使用了系统形状 token `corner-extra-large` 的值。

- **CSS 属性:** `border-radius`
- **值:** `28px`

**示例:**

```css
md-dialog {
  border-radius: 28px;
}
```

#### 背景颜色 (Background Color)

对话框容器的背景颜色使用了系统颜色 token `surface-container-high` 的值。这个颜色值会根据亮色或深色模式有所不同。

- **CSS 属性:** `background-color`
- **值:**
  - 亮色模式: `#ece6f0` (对应调色板 token `neutral92`)
  - 深色模式: `#2b2930` (对应调色板 token `neutral17`)

**示例:**

```css
/* 亮色模式 */
md-dialog {
  background-color: #ece6f0;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  md-dialog {
    background-color: #2b2930;
  }
}
```

#### 阴影 (Box-shadow)

对话框的阴影使用了系统海拔 token `level3` 的值。在 CSS 中，这通常通过叠加多个 `box-shadow` 来实现。阴影颜色使用了系统颜色 token `shadow` 的值，通常是黑色 (`#000`)，并带有不同的透明度。

- **CSS 属性:** `box-shadow`
- **值:**
  - Key shadow: `0px 4px 4px 0px rgba(0, 0, 0, 0.3)`
  - Ambient shadow: `0px 8px 12px 6px rgba(0, 0, 0, 0.15)`

**示例:**

```css
md-dialog {
  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.3),
    0px 8px 12px 6px rgba(0, 0, 0, 0.15);
}
```

#### 边距和内边距 (Margin and Padding)

对话框的边距和内边距用于控制组件内部元素和组件与其他元素之间的空间。

- **对话框容器 (`md-dialog`)**:
  - `margin: auto;` (用于居中)
  - `max-height: min(560px, calc(100% - 48px));`
  - `max-width: min(560px, calc(100% - 48px));`
  - `min-height: 140px;`
  - `min-width: 280px;`
  - `height: fit-content;`
  - `width: fit-content;`

- **标题插槽 (`slot[name='heading']::slotted(*)`)**:
  - `padding: 24px 24px 0;`

- **图标插槽 (`slot[name='icon']::slotted(*)`)**:
  - `margin-top: 24px;`

- **内容插槽 (`slot[name='content']::slotted(*)`)**:
  - `padding: 24px;`

- **动作按钮插槽 (`slot[name='actions']::slotted(*)`)**:
  - `padding: 16px 24px 24px;`

**示例:**

```css
md-dialog {
  margin: auto;
  max-height: min(560px, calc(100% - 48px));
  max-width: min(560px, calc(100% - 48px));
  min-height: 140px;
  min-width: 280px;
  height: fit-content;
  width: fit-content;
}

md-dialog slot[name="heading"]::slotted(*) {
  padding: 24px 24px 0;
}

md-dialog slot[name="content"]::slotted(*) {
  padding: 24px;
}

md-dialog slot[name="actions"]::slotted(*) {
  padding: 16px 24px 24px;
}
```

## 按钮 (Button)

按钮是 M3 中最常用的组件之一，用于触发用户操作。在 Material Web 中，不同类型的按钮有不同的标签，例如 `<md-text-button>`、`<md-elevated-button>`、`<md-filled-button>`、`<md-filled-tonal-button>`、`<md-outlined-button>` 和 `<md-fab>` (Floating Action Button)。

### CSS 标准

虽然不同类型的按钮在样式上有所差异，但它们共享一些基本的 CSS 标准。

#### 圆角 (Border-radius)

按钮的圆角通常使用系统形状 token `corner-full`，这会使按钮呈现药丸状。

- **CSS 属性:** `border-radius`
- **值:** `9999px` (或者 `50%`，取决于具体实现，但效果是完全圆形)

**示例:**

```css
md-button,
md-text-button,
md-elevated-button,
md-filled-button,
md-filled-tonal-button,
md-outlined-button,
md-fab {
  border-radius: 9999px;
}
```

#### 阴影 (Box-shadow)

阴影主要应用于 Elevated Button 和 FAB。阴影值根据海拔高度 token 不同而变化。

- **CSS 属性:** `box-shadow`
- **值:** 根据海拔高度 token (level 1 到 level 5) 不同而变化。例如，Elevated Button 在默认状态下使用 `level1` 的阴影。

**示例 (Elevated Button 默认状态):**

```css
md-elevated-button {
  box-shadow:
    0px 1px 2px 0px rgba(0, 0, 0, 0.3),
    0px 1px 3px 1px rgba(0, 0, 0, 0.15);
}
```

#### 边距和内边距 (Margin and Padding)

按钮的内边距用于控制文本/图标与按钮边界之间的空间。边距用于控制按钮与其他元素之间的空间。

- **按钮容器 (`md-button` 等标签)**:
  - 通常没有固定的 `margin`，由布局容器控制。
  - `height: 40px;` (标准高度)
  - `padding: 0 24px;` (默认水平内边距，对于带图标按钮可能会不同)

- **图标插槽 (`slot[name='icon']::slotted(*)`)**:
  - `margin-inline-end: 8px;` (图标和文本之间的间距)

**示例:**

```css
md-button,
md-text-button,
md-elevated-button,
md-filled-button,
md-filled-tonal-button,
md-outlined-button {
  height: 40px;
  padding: 0 24px;
}

md-fab {
  height: 56px; /* FAB 标准高度 */
  width: 56px; /* FAB 标准宽度 */
  border-radius: 50%; /* FAB 是圆形 */
  padding: 0; /* FAB 没有内边距 */
}

md-button slot[name="icon"]::slotted(*),
md-text-button slot[name="icon"]::slotted(*),
md-elevated-button slot[name="icon"]::slotted(*),
md-filled-button slot[name="icon"]::slotted(*),
md-filled-tonal-button slot[name="icon"]::slotted(*),
md-outlined-button slot[name="icon"]::slotted(*) {
  margin-inline-end: 8px;
}
```

## 文本字段 (Text Field)

文本字段允许用户输入文本。M3 提供了不同类型的文本字段，例如填充式 (`<md-filled-text-field>`) 和轮廓式 (`<md-outlined-text-field>`)。

### CSS 标准

不同类型的文本字段在外观上有所不同，但它们共享一些基本的 CSS 标准。

#### 圆角 (Border-radius)

文本字段的圆角通常使用系统形状 token `corner-medium`。

- **CSS 属性:** `border-radius`
- **值:** `4px` (通常是 `shape.corner.medium`)

**示例:**

```css
md-filled-text-field,
md-outlined-text-field {
  border-radius: 4px; /* shape.corner.medium */
}
```

#### 阴影 (Box-shadow)

文本字段通常没有阴影。

#### 边距和内边距 (Margin and Padding)

文本字段的内边距用于控制文本输入区域与边界之间的空间。边距用于控制文本字段与其他元素之间的空间。

- **文本字段容器 (`md-filled-text-field`, `md-outlined-text-field`)**:
  - 通常没有固定的 `margin`，由布局容器控制。
  - `height: 56px;` (标准高度)
  - `padding: 8px 16px;` (默认内边距，具体值可能因设计而异)

- **文本输入区域 (`input` 或 `textarea`)**:
  - `padding: 0;` (通常由容器控制内边距)

**示例:**

```css
md-filled-text-field,
md-outlined-text-field {
  height: 56px;
  padding: 8px 16px;
}

md-filled-text-field .input,
md-outlined-text-field .input {
  padding: 0;
}
```

## 其他常用 M3 标签 (待补充)

除了对话框、按钮和文本字段，M3 还提供了许多其他常用的标签和组件，例如卡片等。在后续的更新中，将继续补充这些组件的详细介绍和 CSS 标准。
