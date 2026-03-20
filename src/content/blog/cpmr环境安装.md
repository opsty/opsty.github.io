---
title: Caddy、PHP 8.0 及其主要扩展、MariaDB 和 Redis 的全面指南
date: 2025-08-01T10:22:35.000Z
author: DDLG
description: 'Caddy PHP8.0 MariaDB Redis'
pubDate: 2026-03-21
---

在 Ubuntu 系统上安装 Caddy、PHP 8.0 及其主要扩展、MariaDB 和 Redis 的全面指南。

本指南将引导您在 Ubuntu 系统上安装并配置一套功能强大的 Web 服务器环境，包括 Caddy、PHP 8.0、MariaDB 和 Redis。

### 第 1 步：安装 Caddy

Caddy 是一款现代、易于配置的 Web 服务器，以其自动 HTTPS 功能而闻名。

1. **添加 Caddy 官方 GPG 密钥和仓库**
   首先，安装必要的依赖包：

   ```bash
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
   ```

   然后，添加 Caddy 的 GPG 密钥：

   ```bash
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   ```

   接着，添加 Caddy 的稳定版仓库：

   ```bash
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   ```

2. **安装 Caddy**
   更新您的包列表并安装 Caddy：

   ```bash
   sudo apt update
   sudo apt install caddy -y
   ```

3. **验证安装并管理 Caddy 服务**
   检查 Caddy 是否成功安装：

   ```bash
   caddy version
   ```

   您可以启动、停止和查看 Caddy 服务的状态：

   ```bash
   sudo systemctl start caddy
   sudo systemctl stop caddy
   sudo systemctl status caddy
   ```

   为了让 Caddy 在系统启动时自动运行，请启用该服务：

   ```bash
   sudo systemctl enable caddy
   ```

### 第 2 步：安装 PHP 8.0 及主要扩展

由于 Ubuntu 默认仓库中的 PHP 版本可能不是最新的，我们将使用 `ondrej/php` PPA 来安装 PHP 8.0。

1. **添加 PPA 并安装 PHP 8.0**
   首先，添加 `ondrej/php` PPA：

   ```bash
   sudo add-apt-repository ppa:ondrej/php
   sudo apt update
   ```

   然后，安装 PHP 8.0 及其常用扩展：

   ```bash
   sudo apt install php8.0-fpm php8.0-mysql php8.0-mbstring php8.0-xml php8.0-curl php8.0-gd php8.0-zip php8.0-redis -y
   ```

   - `php8.0-fpm`: FastCGI 进程管理器，用于 Caddy 与 PHP 的通信。
   - `php8.0-mysql`: 用于连接 MariaDB/MySQL 数据库。
   - `php8.0-mbstring`: 用于处理多字节字符串。
   - `php8.0-xml`: 用于处理 XML 数据。
   - `php8.0-curl`: 用于执行 HTTP 请求。
   - `php8.0-gd`: 用于图像处理。
   - `php8.0-zip`: 用于处理 ZIP 压缩文件。
   - `php8.0-redis`: 用于连接 Redis。

2. **验证 PHP 安装**
   检查已安装的 PHP 版本：

   ```bash
   php -v
   ```

### 第 3 步：安装 MariaDB

MariaDB 是 MySQL 的一个流行分支，完全兼容并提供了一些增强功能。

1. **安装 MariaDB**
   在 Ubuntu 上，可以直接从官方仓库安装 MariaDB 服务器：

   ```bash
   sudo apt install mariadb-server -y
   ```

2. **安全配置 MariaDB**
   安装后，运行安全脚本来设置 root 密码和移除不安全的默认设置：

   ```bash
   sudo mysql_secure_installation
   ```

   在脚本提示时，您可以设置 root 密码，删除匿名用户，禁止 root 远程登录，并删除测试数据库。

3. **验证 MariaDB 服务**
   检查 MariaDB 服务的状态：

   ```bash
   sudo systemctl status mariadb
   ```

### 第 4 步：安装 Redis

Redis 是一款高性能的键值存储数据库，常用于缓存和会话管理。

1. **安装 Redis**
   从 Ubuntu 仓库安装 Redis 服务器：

   ```bash
   sudo apt install redis-server -y
   ```

2. **配置 Redis (可选)**
   默认情况下，Redis 只允许本地连接。如果需要进行更高级的配置，例如设置密码或允许远程连接，可以编辑其配置文件：

   ```bash
   sudo nano /etc/redis/redis.conf
   ```

   修改配置后，需要重启 Redis 服务：

   ```bash
   sudo systemctl restart redis-server
   ```

3. **验证 Redis 安装**
   使用 Redis 命令行工具测试连接：

   ```bash
   redis-cli
   ```

   在 `redis-cli` 中，输入 `ping`，如果返回 `PONG`，则表示 Redis 正在正常运行。

### Caddyfile 配置示例

为了让 Caddy 能够处理 PHP 请求，您需要编辑 Caddy 的配置文件 `/etc/caddy/Caddyfile`。

以下是一个简单的配置示例，假设您的网站根目录在 `/var/www/html`：

```
your-domain.com {
    root * /var/www/html
    php_fastcgi unix//run/php/php8.0-fpm.sock
    file_server
}
```

请将 `your-domain.com` 替换为您的实际域名，并将 `/var/www/html` 替换为您的网站文件所在的目录。

修改 Caddyfile 后，重新加载 Caddy 配置以使更改生效：

```bash
sudo systemctl reload caddy
```

至此，您已成功在 Ubuntu 系统上安装了 Caddy、PHP 8.0 及其主要扩展、MariaDB 和 Redis。

fileinfo
