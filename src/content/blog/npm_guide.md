---
title: npm_guide
categories: 技术教程
author: DDLG
description: 'npm, package manager, 包管理工具'
pubDate: 2026-03-21
---

# npm 使用指南

npm (Node Package Manager) 是 Node.js 的默认包管理器，也是世界上最大的软件注册表。开发者使用 npm 来发现、共享和使用代码包。本指南将全面介绍 npm 的常用功能和命令。

## 1. npm 是什么？

- **包管理器:** npm 帮助开发者管理项目所依赖的外部代码库（称为“包”或“模块”）。
- **命令行工具:** npm 提供了一个命令行客户端，用于与 npm 注册表交互，执行安装、更新、发布等操作。
- **在线注册表:** npm 维护着一个庞大的公共代码库（npm registry），开发者可以在这里查找和下载包，也可以将自己的包发布上去供他人使用。

## 2. 安装 Node.js 和 npm

npm 通常随 Node.js 一起安装。你可以从 [Node.js 官方网站](https://nodejs.org/) 下载并安装适合你操作系统的 Node.js 版本。安装完成后，可以在终端或命令提示符中运行以下命令来验证 Node.js 和 npm 是否安装成功：

```bash
node -v
npm -v
```

## 3. `package.json` 文件

`package.json` 文件是每个 Node.js 项目的核心配置文件。它包含了项目的元数据（如名称、版本、描述）和依赖信息。

### 作用：

- 描述项目信息。
- 管理项目依赖。
- 定义可执行脚本。
- 使得项目构建可重复。

### 主要字段：

- `name`: 项目名称（必须小写，可以包含连字符和下划线）。
- `version`: 项目版本号（遵循 [SemVer](https://semver.org/) 规范）。
- `description`: 项目描述。
- `main`: 项目的入口文件（通常是 `index.js`）。
- `scripts`: 定义可运行的脚本命令（例如 `start`, `test`, `build`）。
- `dependencies`: 项目在生产环境中需要的依赖包。
- `devDependencies`: 项目在开发环境中需要的依赖包（例如测试框架、构建工具）。
- `author`: 项目作者。
- `license`: 项目许可证（例如 `MIT`, `ISC`）。
- `repository`: 项目代码仓库信息。
- `keywords`: 关键词，便于在 npm 搜索。

## 4. 初始化项目 (`npm init`)

在一个新的项目目录下，运行 `npm init` 命令可以创建一个 `package.json` 文件。它会引导你填写项目的基本信息。

```bash
npm init
```

如果你想快速生成一个默认配置的 `package.json` 文件，可以使用 `-y` 或 `--yes` 标志：

```bash
npm init -y
```

## 5. 安装依赖包 (`npm install`)

`npm install` (或简写 `npm i`) 命令用于安装项目依赖。

### 本地安装 vs 全局安装

- **本地安装 (默认):** 将包安装到当前项目的 `node_modules` 目录下，并记录到 `package.json` 文件中。这是最常用的方式。

  ```bash
  # 安装一个生产依赖
  npm install <package_name>
  npm install <package_name> --save # 旧版 npm 需要 --save，新版默认

  # 安装一个开发依赖
  npm install <package_name> --save-dev
  npm i <package_name> -D # 简写
  ```

- **全局安装:** 将包安装到系统的全局目录中，通常用于安装命令行工具。
  ```bash
  npm install <package_name> -g
  npm i <package_name> --global
  ```

### `--save` vs `--save-dev`

- `--save` (或 `-S`，在新版 npm 中是默认行为): 将包添加到 `dependencies`。
- `--save-dev` (或 `-D`): 将包添加到 `devDependencies`。

### 从 `package.json` 安装

如果项目已有 `package.json` 文件（例如从 Git 克隆下来的项目），可以直接运行 `npm install` 来安装所有在 `dependencies` 和 `devDependencies` 中定义的依赖：

```bash
npm install
npm i
```

## 6. 更新依赖包 (`npm update`)

`npm update` 命令用于将项目依赖更新到 `package.json` 文件中允许的最新版本。

```bash
# 更新所有依赖
npm update

# 更新指定的包
npm update <package_name>
```

要更新到最新的主版本（可能会有破坏性更新），通常需要先检查更新，然后手动修改 `package.json` 并重新运行 `npm install`，或者使用 `npm install <package_name>@latest`。

## 7. 卸载依赖包 (`npm uninstall`)

`npm uninstall` (或 `npm rm`, `npm un`) 命令用于从项目中移除依赖包。

```bash
# 卸载一个包（同时会从 dependencies 或 devDependencies 中移除）
npm uninstall <package_name>

# 卸载一个全局安装的包
npm uninstall <package_name> -g
```

## 8. 查看已安装的包 (`npm list`)

`npm list` (或 `npm ls`) 命令用于查看当前项目已安装的包及其依赖关系。

```bash
# 查看顶层依赖
npm list --depth=0
npm ls -depth=0

# 查看全局安装的顶层依赖
npm list -g --depth=0
```

## 9. 运行脚本 (`npm run`)

`npm run` 命令用于执行在 `package.json` 文件 `scripts` 字段中定义的脚本。

```json
// package.json
"scripts": {
  "start": "node index.js",
  "test": "jest",
  "build": "webpack --config webpack.config.js"
}
```

```bash
# 运行 start 脚本
npm run start
npm start # 对于 start, test, stop, restart 可以省略 run

# 运行 test 脚本
npm run test
npm test

# 运行 build 脚本
npm run build

# 查看所有可运行的脚本
npm run
```

## 10. 发布包到 npm registry (`npm publish`)

如果你开发了一个可重用的 Node.js 模块，可以将其发布到 npm registry 供他人使用。

1.  **登录 npm 账户:**
    ```bash
    npm login
    ```
    （需要先在 [npmjs.com](https://www.npmjs.com/) 注册账户）
2.  **确保 `package.json` 信息完整:** 特别是 `name`, `version`, `main` 等字段。包名必须是唯一的。
3.  **发布包:**
    ```bash
    npm publish
    ```
    （每次发布前通常需要更新 `version` 字段）

## 11. npm 常用命令总结

| 命令                           | 简写                 | 描述                                  |
| ------------------------------ | -------------------- | ------------------------------------- |
| `npm init`                     |                      | 初始化项目，创建 `package.json`       |
| `npm init -y`                  |                      | 使用默认配置快速初始化项目            |
| `npm install`                  | `npm i`              | 安装 `package.json` 中的所有依赖      |
| `npm install <pkg>`            | `npm i <pkg>`        | 安装指定的包（本地，生产依赖）        |
| `npm install <pkg> -D`         | `npm i <pkg> -D`     | 安装指定的包（本地，开发依赖）        |
| `npm install <pkg> -g`         | `npm i <pkg> -g`     | 全局安装指定的包                      |
| `npm update`                   |                      | 更新所有依赖到允许的最新版本          |
| `npm update <pkg>`             |                      | 更新指定的包                          |
| `npm uninstall <pkg>`          | `npm rm <pkg>`       | 卸载指定的包（本地）                  |
| `npm uninstall <pkg> -g`       | `npm rm <pkg> -g`    | 卸载指定的包（全局）                  |
| `npm list`                     | `npm ls`             | 列出已安装的包                        |
| `npm list -g --depth=0`        | `npm ls -g -depth=0` | 列出全局安装的顶层包                  |
| `npm run <script>`             |                      | 运行 `package.json` 中定义的脚本      |
| `npm start`                    |                      | 运行 `start` 脚本                     |
| `npm test`                     |                      | 运行 `test` 脚本                      |
| `npm stop`                     |                      | 运行 `stop` 脚本                      |
| `npm restart`                  |                      | 运行 `restart` 脚本                   |
| `npm search <keyword>`         |                      | 在 npm registry 中搜索包              |
| `npm view <pkg>`               | `npm v <pkg>`        | 查看包的详细信息                      |
| `npm outdated`                 |                      | 检查过期的依赖                        |
| `npm publish`                  |                      | 发布包到 npm registry                 |
| `npm login`                    |                      | 登录 npm 账户                         |
| `npm logout`                   |                      | 登出 npm 账户                         |
| `npm config list`              |                      | 查看 npm 配置                         |
| `npm config set <key> <value>` |                      | 设置 npm 配置项                       |
| `npm config get <key>`         |                      | 获取 npm 配置项的值                   |
| `npm cache clean --force`      |                      | 清理 npm 缓存（有时用于解决安装问题） |
| `npx <command>`                |                      | 执行 npm 包中的命令，无需全局安装     |

## 12. npm 配置 (`npm config`)

npm 的行为可以通过配置文件进行修改。常见的配置包括设置代理、修改 registry 地址等。

```bash
# 查看所有配置
npm config list

# 查看 registry 地址
npm config get registry

# 设置淘宝镜像 registry
npm config set registry https://registry.npmmirror.com

# 删除某个配置项
npm config delete registry

# 编辑配置文件
npm config edit
```

配置文件有多个级别：项目级 (`.npmrc` 文件)、用户级、全局级。

## 13. 使用 npx

`npx` 是 npm v5.2.0 引入的一个工具，用于执行 npm 包中的可执行文件。

### 主要用途：

- **临时运行包命令:** 无需全局或本地安装即可运行某个包提供的命令。
  ```bash
  npx create-react-app my-app # 运行 create-react-app 包来创建 React 应用
  ```
- **运行本地安装的命令:** 可以直接运行 `node_modules/.bin` 目录下的命令，无需配置 `npm run` 脚本。
  ```bash
  # 假设本地安装了 mocha
  npx mocha # 等同于 ./node_modules/.bin/mocha
  ```
- **测试不同版本的 Node.js 或 npm 包:**
  ```bash
  npx node@14 -v # 使用 Node.js 14 版本执行命令
  ```

## 14. npm 镜像和私有仓库（可选）

- **npm 镜像:** 由于 npm 官方 registry 在某些地区访问速度较慢，可以使用国内的镜像源（如淘宝 NPM 镜像）来加速下载。

  ```bash
  # 临时使用淘宝镜像安装
  npm install <package_name> --registry=https://registry.npmmirror.com

  # 永久设置淘宝镜像
  npm config set registry https://registry.npmmirror.com
  ```

  推荐使用 `nrm` 或 `yrm` 等工具来管理不同的 registry 源。

- **私有仓库:** 对于企业或团队内部使用的包，可以搭建私有 npm 仓库（如 Verdaccio, Nexus Repository Manager 等），用于存储和管理内部包，同时可以缓存公共包。

## 15. Node.js 基本使用

虽然 npm 是 Node.js 的包管理器，但了解 Node.js 本身的基本用法对于充分利用 npm 和 JavaScript 生态系统至关重要。

### 运行 JavaScript 脚本

最常见的 Node.js 用法是执行 `.js` 文件。假设你有一个名为 `my_script.js` 的文件：

```javascript
// my_script.js
const message = "Hello from Node.js!";
console.log(message);
```

你可以在终端中使用 `node` 命令来运行它：

```bash
node my_script.js
```

终端将输出：`Hello from Node.js!`

### Node.js REPL (交互式解释器)

Node.js 提供了一个 REPL (Read-Eval-Print Loop) 环境，这是一个交互式的命令行界面，你可以在其中输入 JavaScript 代码并立即看到结果。

在终端中直接运行 `node` 命令即可进入 REPL：

```bash
node
```

你会看到一个 `>` 提示符。现在你可以输入 JavaScript 代码：

```javascript
> const x = 5;
undefined
> x + 10
15
> console.log('Node.js is fun!');
Node.js is fun!
undefined
> .exit // 或按两次 Ctrl+C 退出 REPL
```

REPL 对于快速测试代码片段、学习 JavaScript 语法或探索 Node.js 功能非常有用。

### 核心模块 (Core Modules)

Node.js 内置了许多核心模块，提供了文件系统操作、网络通信、路径处理等基本功能，无需额外安装。你可以使用 `require` 函数来加载这些模块。

- **`fs` (File System):** 用于与文件系统交互，如读写文件。

  ```javascript
  const fs = require("fs");

  // 读取文件内容 (异步)
  fs.readFile("my_script.js", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });

  // 写入文件 (同步)
  try {
    fs.writeFileSync("new_file.txt", "This is some content.");
    console.log("File written successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }
  ```

- **`http`:** 用于创建 HTTP 服务器和客户端。

  ```javascript
  const http = require("http");

  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  });

  server.listen(3000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:3000/");
  });
  ```

- **`path`:** 提供处理文件和目录路径的工具。

  ```javascript
  const path = require("path");

  const filePath = "/users/test/file.txt";
  console.log(path.dirname(filePath)); // 输出: /users/test
  console.log(path.basename(filePath)); // 输出: file.txt
  console.log(path.extname(filePath)); // 输出: .txt
  console.log(path.join("/users", "test", "another_file.md")); // 输出: /users/test/another_file.md (跨平台兼容)
  ```

还有许多其他核心模块，如 `os` (操作系统信息), `events` (事件处理), `url` (URL 解析) 等。你可以查阅 [Node.js 官方文档](https://nodejs.org/api/) 获取完整列表和详细用法。

### 应用场景

Node.js 因其非阻塞 I/O 和事件驱动的特性，在许多领域都有广泛应用：

- **Web 服务器:** 构建高性能的后端 API 和 Web 应用 (常与 Express, Koa 等框架结合)。
- **命令行工具 (CLI):** 开发各种实用的命令行工具。
- **构建工具:** 前端开发中常用的构建、打包、自动化工具（如 Webpack, Gulp, Grunt）通常基于 Node.js。
- **实时应用:** 如聊天室、在线游戏等需要实时通信的应用。
- **微服务:** 构建独立的、可扩展的服务单元。

## 掌握 Node.js 的基本用法将为你使用 npm 管理项目依赖、运行脚本以及进行更广泛的 JavaScript 开发打下坚实的基础。

希望这份指南能帮助你更好地理解和使用 npm！
