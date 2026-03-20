---
title: PowerShell (pwsh) 全面使用指南
date: 2025-05-06 05:20:12
author: DDLG
description: "PowerShell pwsh 脚本 Windows 自动化"
categories: 技术教程
pubDate: 2026-03-21
---

# PowerShell (pwsh) 全面使用指南

## 引言

### PowerShell 是什么？

PowerShell (pwsh) 是微软开发的一种跨平台的任务自动化和配置管理框架，由命令行 shell 和脚本语言组成。它构建在 .NET Framework / .NET Core 之上，旨在帮助 IT 专业人员和开发人员控制和自动化 Windows、Linux 和 macOS 操作系统的管理。与传统的命令行 shell（如 `cmd.exe` 或 Bash）不同，PowerShell 处理的是对象而不是纯文本流，这使得它在数据处理和系统管理方面更加强大和灵活。

### PowerShell 的历史和发展

- **Monad (2003-2006)**：PowerShell 最初代号为 "Monad"，旨在提供一种更强大、更一致的命令行体验。
- **Windows PowerShell 1.0 (2006)**：随 Windows Vista 和 Windows Server 2008 发布，引入了核心概念，如 Cmdlet、管道和对象。
- **Windows PowerShell 2.0 (2009)**：随 Windows 7 和 Windows Server 2008 R2 发布，引入了远程处理 (Remoting)、后台作业 (Background Jobs)、脚本调试和模块化等重要功能。
- **Windows PowerShell 3.0 (2012)**：随 Windows 8 和 Windows Server 2012 发布，改进了工作流、IntelliSense、模块自动加载等。
- **Windows PowerShell 4.0 (2013)**：随 Windows 8.1 和 Windows Server 2012 R2 发布，引入了 Desired State Configuration (DSC)。
- **Windows PowerShell 5.0/5.1 (2015/2016)**：随 Windows 10 和 Windows Server 2016 发布，增强了安全性、类定义、调试和 DSC 功能。
- **PowerShell Core 6.x (2016-2019)**：基于 .NET Core，实现了跨平台（Windows, Linux, macOS），并开源。名称从 "Windows PowerShell" 变为 "PowerShell Core"。
- **PowerShell 7.x (2020-至今)**：统一了 Windows PowerShell 和 PowerShell Core 的发展路径，基于最新的 .NET 版本，继续增强跨平台兼容性、性能和功能。名称简化为 "PowerShell"。

### PowerShell 的核心优势

- **面向对象**：处理结构化数据（对象），而不是纯文本，便于数据提取和操作。
- **一致性**：Cmdlet 遵循 `动词-名词` 的命名规范，易于学习和预测。
- **可扩展性**：通过模块可以轻松添加新的命令和功能。
- **脚本能力**：强大的脚本语言，支持函数、循环、条件判断、错误处理等。
- **远程管理**：内置强大的远程处理能力，可以管理多台计算机。
- **集成性**：与 .NET、WMI、CIM、COM、Active Directory、REST API 等多种技术无缝集成。
- **跨平台**：PowerShell 7+ 可在 Windows、Linux 和 macOS 上运行。
- **自动化**：非常适合自动化重复性任务和复杂的管理流程。

## 基础概念

理解 PowerShell 的核心概念是高效使用它的关键。

### Cmdlet (命令)

Cmdlet（发音 "command-let"）是 PowerShell 的原生命令。它们是轻量级的 .NET 类实例，执行特定的操作。Cmdlet 的命名遵循 `动词-名词` 的模式，例如：

- `Get-Process`：获取当前运行的进程。
- `Stop-Service`：停止一个服务。
- `New-Item`：创建一个新项（如文件或目录）。
- `Set-Content`：设置文件内容。

这种命名规范使得命令的功能易于理解和发现。动词表示操作（Get, Set, New, Remove, Start, Stop 等），名词表示操作的对象（Process, Service, Item, Content 等）。

### 管道 (Pipeline)

管道 (`|`) 是 PowerShell 最强大的特性之一。它允许将一个 Cmdlet 的输出（对象）直接传递给另一个 Cmdlet 作为输入，形成命令链。这使得复杂任务可以通过组合简单的命令来完成。

```powershell
# 获取所有名称以 "s" 开头的服务，并停止它们
Get-Service -Name s* | Stop-Service -WhatIf # -WhatIf 参数用于预览操作，不实际执行

# 获取当前目录下的所有 .log 文件，并计算它们的总大小
Get-ChildItem -Filter *.log | Measure-Object -Property Length -Sum
```

由于 PowerShell 传递的是对象，管道操作比传统的基于文本的管道更加灵活和可靠，无需复杂的文本解析。

### 对象 (Objects)

PowerShell 的核心是对象。Cmdlet 的输出是 .NET 对象，这些对象包含属性（数据）和方法（操作）。

```powershell
# 获取记事本进程对象
$process = Get-Process -Name notepad

# 查看对象的类型
$process.GetType().FullName

# 查看对象的所有成员（属性和方法）
$process | Get-Member

# 访问对象的属性
Write-Host "进程 ID: $($process.Id)"
Write-Host "进程名称: $($process.ProcessName)"
Write-Host "内存使用 (MB): $($process.WorkingSet64 / 1MB)"

# 调用对象的方法 (示例：结束进程)
# $process.Kill()
```

使用对象使得数据处理更加精确，可以通过点 (`.`) 操作符访问对象的属性和方法。

### 变量 (Variables)

变量用于存储数据。在 PowerShell 中，变量名以美元符号 (`$`) 开头。

```powershell
# 赋值
$name = "PowerShell User"
$count = 10
$processes = Get-Process

# 使用变量
Write-Host "Hello, $name!"
Write-Host "There are $count items."
Write-Host "Number of processes: $($processes.Count)" # 在字符串中使用表达式

# 变量类型 (PowerShell 通常会自动推断)
$number = 100       # [int]
$pi = 3.14159     # [double]
$text = "Some text" # [string]
$today = Get-Date    # [datetime]
$list = 1, 2, 3    # [object[]], 实际上是 [int[]]

# 强制类型
[string]$value = 123
Write-Host $value.GetType().Name # 输出 String
```

### 别名 (Aliases)

别名是 Cmdlet 或命令的替代名称，通常更短，便于快速输入。PowerShell 提供了许多内置别名，尤其是为了兼容 Unix/Linux 和 `cmd.exe` 用户。

- `ls` 或 `dir` 是 `Get-ChildItem` 的别名。
- `cd` 是 `Set-Location` 的别名。
- `ps` 是 `Get-Process` 的别名。
- `kill` 是 `Stop-Process` 的别名。
- `cat` 或 `type` 是 `Get-Content` 的别名。
- `echo` 是 `Write-Host` 或 `Write-Output` 的别名。
- `cp` 或 `copy` 是 `Copy-Item` 的别名。
- `rm` 或 `del` 是 `Remove-Item` 的别名。

可以使用 `Get-Alias` 查看所有别名，`New-Alias` 创建自定义别名。

**注意**：在编写脚本时，建议使用完整的 Cmdlet 名称以提高可读性和可维护性，避免使用别名。

### 提供程序 (Providers)

PowerShell Provider 允许像访问文件系统一样访问不同的数据存储。例如：

- `FileSystem`：访问文件和目录 (C:, D:)。
- `Registry`：访问 Windows 注册表 (HKLM:, HKCU:)。
- `Environment`：访问环境变量 (Env:)。
- `Variable`：访问当前会话的变量 (Variable:)。
- `Function`：访问当前会话的函数 (Function:)。
- `Alias`：访问当前会话的别名 (Alias:)。
- `Certificate`：访问证书存储 (Cert:)。

可以使用 `Get-PSProvider` 查看所有可用的提供程序。通过提供程序，可以使用标准的 `Item` Cmdlet（如 `Get-Item`, `Set-Item`, `Get-ChildItem`）来操作这些不同的数据源。

```powershell
# 切换到注册表驱动器
Set-Location HKLM:\SOFTWARE\Microsoft

# 列出子项
Get-ChildItem

# 查看环境变量
Get-ChildItem Env:

# 查看 PATH 环境变量
$env:PATH
```

### 执行策略 (Execution Policy)

执行策略是 PowerShell 的一项安全功能，用于控制加载配置文件和运行脚本的条件。它有助于防止恶意脚本的执行。

可以使用 `Get-ExecutionPolicy` 查看当前策略，`Set-ExecutionPolicy` 进行设置（需要管理员权限）。

常见的策略级别：

- **Restricted**：默认策略（Windows 客户端）。不允许运行任何脚本。只允许交互式命令。
- **AllSigned**：只允许运行由受信任发布者签名的脚本。
- **RemoteSigned**：默认策略（Windows 服务器）。允许运行本地创建的脚本；从网络下载的脚本必须由受信任发布者签名。
- **Unrestricted**：允许运行所有脚本，但对来自网络的未签名脚本会提示确认。
- **Bypass**：不阻止任何操作，也没有警告或提示。
- **Undefined**：没有定义执行策略。

```powershell
# 查看当前策略
Get-ExecutionPolicy -List # 查看所有作用域的策略

# 设置执行策略 (需要管理员权限)
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

可以使用 `-Scope` 参数指定策略的作用范围（如 `Process`, `CurrentUser`, `LocalMachine`）。

## 常用命令 (Cmdlets)

掌握常用的 Cmdlet 是日常使用 PowerShell 的基础。

### 文件和目录操作

- **`Get-ChildItem` (alias: `ls`, `dir`, `gci`)**: 列出目录内容或文件信息。
  ```powershell
  Get-ChildItem C:\Windows
  Get-ChildItem -Path C:\Users -Directory # 只列出目录
  Get-ChildItem -Path C:\Logs -Filter *.log -Recurse # 递归查找 .log 文件
  Get-ChildItem -Path . -File | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} # 查找30天前修改的文件
  ```
- **`Copy-Item` (alias: `cp`, `copy`, `cpi`)**: 复制文件或目录。
  ```powershell
  Copy-Item -Path C:\source.txt -Destination D:\backup\
  Copy-Item -Path C:\MyFolder -Destination D:\BackupFolder -Recurse # 复制目录及其内容
  ```
- **`Remove-Item` (alias: `rm`, `del`, `erase`, `rd`, `ri`)**: 删除文件或目录。
  ```powershell
  Remove-Item -Path C:\temp\oldfile.txt
  Remove-Item -Path C:\Temp\* -Recurse -Force # 强制递归删除 Temp 目录下所有内容
  ```
- **`New-Item` (alias: `ni`, `md`, `mkdir`)**: 创建新项（文件、目录等）。
  ```powershell
  New-Item -Path C:\MyNewFolder -ItemType Directory
  New-Item -Path C:\MyNewFile.txt -ItemType File -Value "Initial content"
  ```
- **`Set-Location` (alias: `cd`, `sl`)**: 更改当前工作目录。
  ```powershell
  Set-Location C:\Windows\System32
  cd .. # 返回上一级目录
  cd ~   # 返回用户主目录
  ```
- **`Get-Content` (alias: `cat`, `type`, `gc`)**: 获取文件内容。
  ```powershell
  Get-Content -Path C:\config.ini
  Get-Content -Path C:\log.txt -Tail 10 # 获取最后 10 行
  Get-Content -Path C:\largefile.log -TotalCount 100 # 获取前 100 行
  (Get-Content -Path C:\users.json) | ConvertFrom-Json # 读取 JSON 文件并转换为对象
  ```
- **`Set-Content` (alias: `sc`)**: 设置（覆盖）文件内容。
  ```powershell
  Set-Content -Path C:\status.txt -Value "Process Complete"
  Get-Process | Out-String | Set-Content -Path C:\processes.txt # 将进程列表写入文件
  ```
- **`Add-Content` (alias: `ac`)**: 向文件追加内容。
  ```powershell
  Add-Content -Path C:\app.log -Value "$(Get-Date): Application started."
  ```

### 进程管理

- **`Get-Process` (alias: `ps`, `gps`)**: 获取正在运行的进程。
  ```powershell
  Get-Process
  Get-Process -Name notepad, chrome
  Get-Process | Sort-Object -Property CPU -Descending | Select-Object -First 5 # CPU 占用最高的 5 个进程
  ```
- **`Stop-Process` (alias: `kill`, `spps`)**: 停止一个或多个进程。
  ```powershell
  Stop-Process -Name notepad
  Get-Process -Name "badapp*" | Stop-Process -Force -WhatIf
  Stop-Process -Id 1234
  ```
- **`Start-Process` (alias: `start`, `saps`)**: 启动一个新进程。
  ```powershell
  Start-Process notepad.exe
  Start-Process C:\MyApp\run.bat
  Start-Process https://www.microsoft.com # 打开默认浏览器访问 URL
  Start-Process powershell -Verb RunAs # 以管理员身份启动 PowerShell
  ```

### 服务管理

- **`Get-Service` (alias: `gsv`)**: 获取系统服务。
  ```powershell
  Get-Service
  Get-Service -Name WinRM, Spooler
  Get-Service -DisplayName "*Network*" # 按显示名称查找
  Get-Service | Where-Object {$_.Status -eq 'Running'} # 获取正在运行的服务
  ```
- **`Start-Service` (alias: `sasv`)**: 启动服务。
  ```powershell
  Start-Service -Name Spooler
  Get-Service -Name BITS | Start-Service
  ```
- **`Stop-Service` (alias: `spsv`)**: 停止服务。
  ```powershell
  Stop-Service -Name Spooler -Force
  Get-Service -Name "MyCustomService" | Stop-Service -WhatIf
  ```
- **`Restart-Service` (alias: `rsv`)**: 重启服务。
  ```powershell
  Restart-Service -Name WinRM -Force
  ```
- **`Set-Service`**: 修改服务属性（如启动类型）。
  ```powershell
  Set-Service -Name MyService -StartupType Automatic
  Get-Service -Name UnwantedSvc | Set-Service -StartupType Disabled
  ```

### 网络操作

- **`Test-Connection` (alias: `ping`, `tcon`)**: 向远程计算机发送 ICMP Echo 请求。
  ```powershell
  Test-Connection -ComputerName google.com
  Test-Connection -ComputerName server01, server02 -Count 1 -Quiet # 只返回 True/False
  ```
- **`Resolve-DnsName`**: 执行 DNS 查询。
  ```powershell
  Resolve-DnsName -Name www.google.com
  Resolve-DnsName -Name 8.8.8.8 # 反向查询
  Resolve-DnsName -Name _sip._tcp.example.com -Type SRV # 查询 SRV 记录
  ```
- **`Invoke-WebRequest` (alias: `iwr`, `wget`, `curl`)**: 向 Web 服务发送 HTTP/HTTPS 请求（返回详细响应对象）。
  ```powershell
  Invoke-WebRequest -Uri https://api.github.com
  $response = Invoke-WebRequest -Uri http://example.com/login -Method Post -Body @{user='admin'; pass='password'} -SessionVariable websession
  Invoke-WebRequest -Uri http://example.com/data -WebSession $websession
  Invoke-WebRequest -Uri ftp://example.com/file.zip -OutFile C:\downloads\file.zip
  ```
- **`Invoke-RestMethod` (alias: `irm`)**: 向 RESTful Web 服务发送 HTTP/HTTPS 请求（自动处理响应，如 JSON/XML）。

  ```powershell
  $weather = Invoke-RestMethod -Uri "https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=London"
  Write-Host "Current temperature in London: $($weather.current.temp_c)°C"

  $data = @{ name = "New Item"; value = 123 } | ConvertTo-Json
  Invoke-RestMethod -Uri "https://myapi.com/items" -Method Post -Body $data -ContentType "application/json"
  ```

### 系统信息

- **`Get-ComputerInfo`**: 获取本地计算机的详细系统信息。
  ```powershell
  Get-ComputerInfo
  Get-ComputerInfo -Property OsName, OsVersion, CsProcessors, PhysiscalMemorySize
  ```
- **`Get-WmiObject` (alias: `gwmi`)**: (旧版) 使用 WMI 获取管理信息。
  ```powershell
  Get-WmiObject -Class Win32_OperatingSystem | Select-Object -Property Caption, Version, OSArchitecture
  Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3" # 获取本地硬盘
  Get-WmiObject -Class Win32_Product | Where-Object {$_.Name -like "*Office*"} # 查找已安装的 Office 产品 (可能较慢)
  ```
- **`Get-CimInstance` (alias: `gcim`)**: (新版, 推荐) 使用 CIM (基于 WS-Management) 获取管理信息，更现代且支持远程。
  ```powershell
  Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object -Property Caption, Version, OSArchitecture
  Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DriveType=3"
  Get-CimInstance -ClassName Win32_BIOS -ComputerName server01 # 获取远程计算机的 BIOS 信息
  ```

### 帮助系统

- **`Get-Help` (alias: `help`, `man`)**: 显示 Cmdlet 或概念的帮助信息。
  ```powershell
  Get-Help Get-Process
  Get-Help Get-Process -Examples # 查看示例
  Get-Help Get-Process -Full # 查看完整帮助
  Get-Help Get-Process -Parameter Name # 查看特定参数的帮助
  Get-Help about_Operators # 查看关于运算符的概念性帮助
  help Copy-Item # 简写形式
  Copy-Item -? # 另一种获取帮助的方式
  ```
- **`Update-Help`**: 下载并安装最新的帮助文件（需要管理员权限和网络连接）。
  ```powershell
  Update-Help
  Update-Help -Module ActiveDirectory -Force # 更新特定模块的帮助
  ```

### 格式化输出

PowerShell 默认会根据对象类型选择合适的格式化方式，但你也可以手动控制。

- **`Format-Table` (alias: `ft`)**: 将输出格式化为表格。
  ```powershell
  Get-Process | Format-Table -Property ProcessName, Id, CPU, WorkingSet -AutoSize
  Get-Service | Format-Table -GroupBy Status
  ```
- **`Format-List` (alias: `fl`)**: 将输出的每个对象的属性格式化为列表。
  ```powershell
  Get-Process -Name powershell | Format-List -Property * # 显示所有属性
  Get-Service -Name WinRM | fl *
  ```
- **`Out-GridView` (alias: `ogv`)**: 将输出发送到一个可交互的网格视图窗口（支持排序和筛选）。
  ```powershell
  Get-Process | Out-GridView -Title "Running Processes"
  Get-Service | Where-Object {$_.Status -eq 'Stopped'} | Out-GridView
  ```
- **`Out-File`**: 将输出发送到文件。
  ```powershell
  Get-Process | Out-File -FilePath C:\processes.txt
  ```
- **`Out-String`**: 将对象转换为字符串。
  ```powershell
  $processInfo = Get-Process -Name explorer | Out-String
  Write-Host $processInfo
  ```

### 对象操作

这些 Cmdlet 通常用于管道中，对传递的对象进行筛选、选择、排序等操作。

- **`Select-Object` (alias: `select`)**: 选择对象的特定属性，或从对象集合中选择特定数量的对象。
  ```powershell
  Get-Process | Select-Object -Property ProcessName, Id, MainWindowTitle
  Get-ChildItem | Select-Object -First 5 # 获取前 5 个项
  Get-ChildItem | Select-Object -Last 5 # 获取后 5 个项
  Get-Process | Select-Object -Property Name, @{Name='MemoryMB';Expression={$_.WorkingSet64 / 1MB}} # 计算属性
  Get-Content file.txt | Select-Object -Unique # 获取唯一行
  ```
- **`Where-Object` (alias: `where`, `?`)**: 根据指定的条件筛选对象。
  ```powershell
  Get-Process | Where-Object {$_.CPU -gt 100} # CPU 时间大于 100 的进程
  Get-Service | Where-Object {$_.Status -eq 'Running' -and $_.DisplayName -like '*SQL*'} # 运行中且名称包含 SQL 的服务
  Get-ChildItem -Recurse | Where-Object {$_.Length -gt 1GB} # 大于 1GB 的文件
  # 简化语法 (PowerShell 3.0+)
  Get-Process | Where CPU -gt 100
  Get-Service | Where Status -eq 'Running'
  ```
- **`Sort-Object` (alias: `sort`)**: 对对象进行排序。
  ```powershell
  Get-Process | Sort-Object -Property CPU -Descending # 按 CPU 降序排序
  Get-ChildItem | Sort-Object -Property Length # 按文件大小升序排序
  Get-Service | Sort-Object -Property Status, DisplayName # 先按状态，再按名称排序
  ```
- **`Measure-Object` (alias: `measure`)**: 计算对象的数值属性（计数、总和、平均值、最大值、最小值）。
  ```powershell
  Get-ChildItem -Filter *.exe | Measure-Object -Property Length -Sum -Average -Maximum
  Get-Content C:\log.txt | Measure-Object -Line -Word -Character # 统计行数、单词数、字符数
  ```
- **`Group-Object` (alias: `group`)**: 根据指定的属性对对象进行分组。
  ```powershell
  Get-Process | Group-Object -Property Company
  Get-ChildItem | Group-Object -Property Extension # 按文件扩展名分组
  Get-Service | Group-Object -Property Status # 按服务状态分组
  ```

## 脚本编写

PowerShell 不仅仅是一个 shell，还是一种强大的脚本语言。PowerShell 脚本文件通常以 `.ps1` 为扩展名。

### 创建和运行脚本 (.ps1 文件)

1.  **创建脚本**：使用文本编辑器（如 VS Code、Notepad++ 或 ISE）创建一个文件，例如 `MyScript.ps1`。
2.  **编写代码**：在文件中写入 PowerShell 命令和逻辑。

    ```powershell
    # MyScript.ps1
    param(
        [string]$Name = "World"
    )

    Write-Host "Hello, $Name!"
    $date = Get-Date
    Write-Host "The current date and time is: $date"
    ```

3.  **运行脚本**：
    - 确保执行策略允许运行脚本（例如 `RemoteSigned` 或 `Unrestricted`）。
    - 在 PowerShell 控制台中，使用完整路径或相对路径执行脚本：

      ```powershell
      # 使用相对路径 (如果脚本在当前目录)
      .\MyScript.ps1

      # 使用绝对路径
      C:\Scripts\MyScript.ps1

      # 传递参数
      .\MyScript.ps1 -Name "PowerShell User"
      ```

### 变量和数据类型

PowerShell 支持多种数据类型：

- **基本类型**: `[string]`, `[int]`, `[long]`, `[double]`, `[bool]` (`$true`, `$false`), `[datetime]`, `[char]`
- **集合类型**: `[array]`, `[hashtable]` (哈希表/字典)
- **特殊类型**: `[null]`, `[scriptblock]`, `[type]`, `[xml]`, `[adsi]`

```powershell
# 字符串
$message = "Hello"

# 整数
$count = 42

# 布尔值
$isEnabled = $true

# 日期时间
$now = Get-Date

# 数组
$colors = "Red", "Green", "Blue"
$numbers = @(1, 2, 3, 4, 5)
Write-Host $colors[0] # 输出 Red
$colors += "Yellow" # 添加元素

# 哈希表 (键值对)
$user = @{
    Name = "Alice"
    Age = 30
    City = "New York"
}
Write-Host $user.Name # 输出 Alice
Write-Host $user["Age"] # 输出 30
$user.Email = "alice@example.com" # 添加键值对
```

### 运算符

PowerShell 提供了丰富的运算符：

- **算术**: `+`, `-`, `*`, `/`, `%` (取模)
- **赋值**: `=`, `+=`, `-=`, `*=`, `/=`, `%=`
- **比较**:
  - `-eq` (等于), `-ne` (不等于)
  - `-gt` (大于), `-ge` (大于等于)
  - `-lt` (小于), `-le` (小于等于)
  - `-like` (通配符匹配, `*`, `?`), `-notlike`
  - `-match` (正则表达式匹配), `-notmatch`
  - `-contains` (集合包含某值), `-notcontains`
  - `-in` (某值在集合中), `-notin`
  - **注意**: 比较运算符默认不区分大小写。使用区分大小写的版本，在前面加 `c` (e.g., `-ceq`, `-clike`, `-cmatch`)。使用不区分大小写的版本（默认），可以在前面加 `i` (e.g., `-ieq`, `-ilike`, `-imatch`)。
- **逻辑**: `-and`, `-or`, `-xor`, `-not` (`!`)
- **类型**: `-is`, `-isnot`
- **位**: `-band`, `-bor`, `-bxor`, `-bnot`, `-shl` (左移), `-shr` (右移)
- **其他**: `.` (成员访问), `::` (静态成员访问), `..` (范围), `-join` (连接数组元素), `-split` (分割字符串), `-replace` (替换字符串), `-f` (格式化)

```powershell
$a = 10
$b = 5
if (($a -gt $b) -and ($a -lt 100)) { Write-Host "a is between 5 and 100" }

$name = "PowerShell"
if ($name -like "Power*") { Write-Host "Name starts with Power" }

$list = "apple", "banana", "cherry"
if ("banana" -in $list) { Write-Host "Found banana" }

$text = "The quick brown fox"
$words = $text -split " " # 按空格分割
Write-Host ($words -join ", ") # 用逗号连接

"Value is {0:N2}" -f 1234.567 # 格式化输出: Value is 1,234.57
```

### 控制流

- **`if / elseif / else`**: 条件执行。
  ```powershell
  $score = 75
  if ($score -ge 90) {
      Write-Host "Grade A"
  } elseif ($score -ge 80) {
      Write-Host "Grade B"
  } elseif ($score -ge 70) {
      Write-Host "Grade C"
  } else {
      Write-Host "Grade D or F"
  }
  ```
- **`switch`**: 多条件分支。
  ```powershell
  $day = (Get-Date).DayOfWeek
  switch ($day) {
      "Monday" { Write-Host "Start of the week" }
      "Friday" { Write-Host "Almost weekend!" }
      "Saturday"
      "Sunday" { Write-Host "Weekend!" }
      Default { Write-Host "Weekday" }
  }
  # switch 支持通配符和正则表达式
  switch -Wildcard ("apple") {
      "a*" { Write-Host "Starts with a" }
      "b*" { Write-Host "Starts with b" }
  }
  ```
- **`for`**: 固定次数循环。
  ```powershell
  for ($i = 1; $i -le 5; $i++) {
      Write-Host "Iteration $i"
  }
  ```
- **`foreach`**: 遍历集合中的每个元素。
  ```powershell
  $colors = "Red", "Green", "Blue"
  foreach ($color in $colors) {
      Write-Host "Color: $color"
  }
  # 也可以用于管道
  Get-Process | foreach { Write-Host "Process $($_.Name) has ID $($_.Id)" }
  # 简化写法 (ForEach-Object alias: foreach, %)
  Get-Process | % { Write-Host "Process $($_.Name) has ID $($_.Id)" }
  ```
- **`while`**: 当条件为真时循环。
  ```powershell
  $count = 0
  while ($count -lt 3) {
      Write-Host "Count is $count"
      $count++
  }
  ```
- **`do / while`**: 先执行一次，然后当条件为真时循环。
  ```powershell
  $num = 0
  do {
      $input = Read-Host "Enter a number (0 to exit)"
      $num = [int]$input
      Write-Host "You entered $num"
  } while ($num -ne 0)
  ```
- **`do / until`**: 先执行一次，然后当条件为假时循环。
  ```powershell
  $response = ""
  do {
      $response = Read-Host "Do you want to continue? (yes/no)"
  } until ($response -eq "no")
  ```
- **`break`**: 跳出当前循环 (for, foreach, while, do, switch)。
- **`continue`**: 跳过当前循环的剩余部分，进入下一次迭代。

### 函数

函数用于封装可重用的代码块。

```powershell
# 简单函数
function Show-Greeting {
    Write-Host "Hello from the function!"
}
Show-Greeting # 调用函数

# 带参数的函数
function Get-Square {
    param(
        [Parameter(Mandatory=$true, Position=0)] # 定义参数属性
        [int]$Number
    )
    $result = $Number * $Number
    return $result # 返回值
}
$sq = Get-Square -Number 5
Write-Host "5 squared is $sq"
Get-Square 10 # 位置参数

# 高级函数 (CmdletBinding) - 使函数行为更像 Cmdlet
function Send-Notification {
    [CmdletBinding(SupportsShouldProcess=$true)] # 支持 -WhatIf 和 -Confirm
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,

        [Parameter()]
        [string]$Recipient = "DefaultUser"
    )

    # 如果用户使用了 -WhatIf 或需要确认
    if ($PSCmdlet.ShouldProcess($Recipient, "Send Notification: $Message")) {
        Write-Host "Sending notification to $Recipient: '$Message'"
        # ... 实际发送逻辑 ...
        Write-Verbose "Notification sent successfully." # 详细输出
    }
}

Send-Notification -Message "System update complete" -Recipient "Admin" -Verbose
Send-Notification -Message "Rebooting server" -Recipient "All Users" -WhatIf # 预览操作
```

### 作用域 (Scope)

作用域决定了变量、函数、别名等的可访问性。

- **Global**: PowerShell 启动时创建，会话结束时销毁。全局变量在任何地方都可访问。
- **Local**: 当前作用域。可以是全局作用域、脚本作用域或函数作用域。默认情况下，变量在此作用域创建。
- **Script**: 脚本文件运行时创建的作用域。脚本中的代码默认在此作用域运行。
- **Private**: 变量仅在当前作用域可见，子作用域不可见。

可以使用作用域修饰符访问或修改不同作用域的变量：`$global:var`, `$script:var`, `$local:var`。

```powershell
$global:appVersion = "1.0"

function Test-Scope {
    $localVariable = "I am local"
    Write-Host "Inside function: Global variable is $global:appVersion"
    Write-Host "Inside function: Local variable is $localVariable"
    # $script:scriptVar = "Set in function" # 如果在脚本中调用，会设置脚本变量
}

Test-Scope
Write-Host "Outside function: Global variable is $global:appVersion"
# Write-Host $localVariable # 错误，局部变量在函数外不可见
```

### 注释

- 单行注释：`# This is a comment`
- 多行注释：
  ```powershell
  <#
  This is a
  multi-line comment block.
  It can span multiple lines.
  #>
  ```
- 基于块的注释通常用于函数或脚本的帮助文档（Comment-Based Help）。

## 模块管理

模块是包含 PowerShell 成员（如 Cmdlet、函数、变量、提供程序等）的可重用单元。它们是组织和共享 PowerShell 代码的主要方式。

### 什么是模块？

模块通常是一个包含 `.psm1` (脚本模块)、`.psd1` (模块清单) 或二进制程序集 (`.dll`) 的目录。PowerShell 会在 `$env:PSModulePath` 指定的路径下查找模块。

### 查找模块 (`Find-Module`)

从 PowerShell Gallery (官方在线模块仓库) 查找模块。

```powershell
# 查找名称包含 "Azure" 的模块
Find-Module -Name *Azure*

# 查找特定模块
Find-Module -Name Pester # Pester 是一个流行的测试框架

# 查看模块信息
Find-Module -Name Az | Format-List
```

### 安装模块 (`Install-Module`)

从 PowerShell Gallery 安装模块（通常需要管理员权限）。

```powershell
# 安装最新的 Az (Azure) 模块 (为当前用户)
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force

# 安装特定版本的模块
Install-Module -Name Pester -RequiredVersion 4.10.1

# 更新已安装的模块
Update-Module -Name Az
```

### 导入模块 (`Import-Module`)

将模块加载到当前会话中，使其命令可用。PowerShell 3.0+ 支持模块自动加载，当你首次使用模块中的命令时，它会自动导入。但有时需要显式导入。

```powershell
# 显式导入模块
Import-Module -Name ActiveDirectory

# 查看模块支持的命令
Get-Command -Module ActiveDirectory

# 强制重新导入模块
Import-Module -Name MyCustomModule -Force
```

### 获取已加载模块 (`Get-Module`)

列出当前会话中已加载或可用的模块。

```powershell
# 列出已加载的模块
Get-Module

# 列出所有可用（包括未加载）的模块
Get-Module -ListAvailable
```

### 创建自定义模块

1.  **创建目录**: 例如 `C:\Users\YourUser\Documents\PowerShell\Modules\MyCustomModule`
2.  **创建脚本模块文件 (`.psm1`)**: `MyCustomModule.psm1`

    ```powershell
    # MyCustomModule.psm1
    function Get-MyData {
        param([string]$Source)
        Write-Host "Getting data from $Source..."
        # ... 实际逻辑 ...
        return @{ Data = "Sample"; Timestamp = Get-Date }
    }

    function Set-MyConfig {
        param([string]$Key, [string]$Value)
        Write-Host "Setting config $Key = $Value"
        # ... 实际逻辑 ...
    }

    # 导出希望公开的函数
    Export-ModuleMember -Function Get-MyData, Set-MyConfig
    ```

3.  **(可选) 创建模块清单文件 (`.psd1`)**: `MyCustomModule.psd1`。清单文件包含模块的元数据（版本、作者、依赖项、要导出的成员等）。使用 `New-ModuleManifest` 创建。
    ```powershell
    New-ModuleManifest -Path .\MyCustomModule.psd1 -RootModule MyCustomModule.psm1 -Author "Your Name" -Description "My custom utility module." -FunctionsToExport 'Get-MyData', 'Set-MyConfig'
    ```
4.  **使用模块**: PowerShell 会自动在 `$env:PSModulePath` 中找到你的模块。
    ```powershell
    Import-Module MyCustomModule # 或者让它自动加载
    Get-MyData -Source "Database"
    Set-MyConfig -Key "Timeout" -Value "300"
    ```

## 远程管理 (Remoting)

PowerShell Remoting 允许你在远程计算机上运行命令，就像在本地一样。它主要基于 Windows Remote Management (WinRM) 服务，该服务是 WS-Management 协议的微软实现。

### 启用和配置 WinRM

- **服务器端**: 在要管理的远程计算机上，以管理员身份运行 PowerShell 并执行：
  ```powershell
  Enable-PSRemoting -Force
  ```
  此命令会：
  - 启动 WinRM 服务并设置为自动启动。
  - 创建防火墙规则以允许入站连接。
  - 创建用于接受远程连接的监听器。
- **客户端**: 通常无需特殊配置，但需要确保网络连接正常，并且防火墙允许出站连接。客户端和服务器需要能够相互认证（通常通过 Active Directory 或提供凭据）。

可以使用 `Test-WSMan` 测试连接：

```powershell
Test-WSMan -ComputerName RemoteServerName
```

### 建立远程会话

- **`Enter-PSSession`**: 启动一个交互式远程会话。你的提示符会改变，之后输入的命令将在远程计算机上执行。
  ```powershell
  Enter-PSSession -ComputerName Server01
  # [Server01]: PS C:\Users\Admin\Documents> hostname  # 命令在 Server01 上执行
  # [Server01]: PS C:\Users\Admin\Documents> Get-Process -Name explorer
  # [Server01]: PS C:\Users\Admin\Documents> exit      # 退出远程会话
  ```
- **`New-PSSession`**: 创建一个持久的 PSSession 对象，可以在后续命令中重用。适用于需要多次连接或管理多个会话的场景。

  ```powershell
  # 创建到一台服务器的会话
  $session = New-PSSession -ComputerName Server01

  # 创建到多台服务器的会话
  $servers = "Server01", "Server02", "WebSrv03"
  $sessions = New-PSSession -ComputerName $servers

  # 查看会话
  Get-PSSession

  # 使用会话 (见 Invoke-Command)

  # 关闭会话
  Remove-PSSession -Session $session
  Get-PSSession | Remove-PSSession # 关闭所有会话
  ```

### 在远程计算机上执行命令 (`Invoke-Command`)

这是最常用的远程处理 Cmdlet，用于在一台或多台远程计算机上运行命令或脚本块。

```powershell
# 在单台远程计算机上运行命令
Invoke-Command -ComputerName Server01 -ScriptBlock { Get-Service -Name WinRM }

# 在多台远程计算机上运行命令
$servers = "Server01", "Server02"
Invoke-Command -ComputerName $servers -ScriptBlock { Get-EventLog -LogName System -Newest 5 }

# 使用预先创建的会话 (更高效，避免重复认证)
$sessions = New-PSSession -ComputerName Server01, Server02
Invoke-Command -Session $sessions -ScriptBlock { Restart-Service -Name Spooler -Force }

# 传递本地变量到远程脚本块
$localPath = "C:\Logs"
Invoke-Command -ComputerName Server01 -ScriptBlock {
    param($path) # 接收参数
    Get-ChildItem -Path $path
} -ArgumentList $localPath # 传递参数

# 使用 $using: 作用域修饰符 (PowerShell 3.0+) 访问本地变量
$threshold = 100MB
Invoke-Command -ComputerName Server01 -ScriptBlock {
    Get-Process | Where-Object {$_.WorkingSet64 -gt $using:threshold}
}

# 运行本地脚本文件在远程计算机上
Invoke-Command -ComputerName Server01, Server02 -FilePath C:\Scripts\CheckDiskSpace.ps1
```

### 隐式远程处理 (Implicit Remoting)

将远程模块的命令导入到本地会话，使得远程命令看起来像本地命令一样运行。

```powershell
# 1. 创建到远程服务器的会话 (例如 Exchange 服务器)
$session = New-PSSession -ConfigurationName Microsoft.Exchange -ConnectionUri http://ExchServer/PowerShell/ -Authentication Kerberos

# 2. 将远程模块的命令导入本地
Import-PSSession -Session $session -Module ExchangeOnlineManagement # 假设模块名

# 3. 像本地命令一样使用远程命令 (实际仍在远程执行)
Get-Mailbox -Identity user@example.com
New-DistributionGroup -Name "Sales Team"

# 4. 完成后断开会话
Remove-PSSession -Session $session
```

## 与其他技术的集成

PowerShell 的强大之处在于它能与多种现有技术无缝集成。

### .NET Framework/Core

PowerShell 构建在 .NET 之上，可以直接访问和使用 .NET 类库。

```powershell
# 创建 .NET 对象
$sb = New-Object System.Text.StringBuilder
$sb.Append("Hello, ")
$sb.Append(".NET!")
$sb.ToString()

# 调用静态方法
[System.Math]::Sqrt(144) # 计算平方根
[System.IO.File]::Exists("C:\Windows\notepad.exe")
[System.Guid]::NewGuid() # 生成 GUID

# 加载自定义程序集
Add-Type -Path "C:\MyLibs\MyLibrary.dll"
$myObject = New-Object MyNamespace.MyClass
$myObject.MyMethod()
```

### WMI (Windows Management Instrumentation)

WMI 是访问 Windows 系统管理信息的传统接口。

```powershell
# 使用 Get-WmiObject (旧版)
Get-WmiObject -Class Win32_ComputerSystem | Select-Object -Property Manufacturer, Model
Get-WmiObject -Namespace root\SecurityCenter2 -Class AntiVirusProduct # 获取杀毒软件信息

# 调用 WMI 方法
$service = Get-WmiObject -Class Win32_Service -Filter "Name='Spooler'"
$service.StopService()
$service.StartService()
```

### CIM (Common Information Model)

CIM 是 WMI 的现代替代方案，基于 WS-Management 协议，更标准化且跨平台友好。`Get-CimInstance` 是推荐使用的 Cmdlet。

```powershell
# 使用 Get-CimInstance
Get-CimInstance -ClassName Win32_ComputerSystem | Select-Object -Property Manufacturer, Model
Get-CimInstance -Namespace root\SecurityCenter2 -ClassName AntiVirusProduct

# 调用 CIM 方法
$service = Get-CimInstance -ClassName Win32_Service -Filter "Name='Spooler'"
Invoke-CimMethod -InputObject $service -MethodName StopService
Invoke-CimMethod -InputObject $service -MethodName StartService

# 远程 CIM 操作
Get-CimInstance -ClassName Win32_Process -ComputerName Server01 | Where-Object Name -like "sql*"
```

### COM (Component Object Model)

PowerShell 可以与 COM 对象交互，例如自动化 Office 应用程序。

```powershell
# 自动化 Excel 示例
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $true # 使 Excel 可见
$workbook = $excel.Workbooks.Add()
$sheet = $workbook.Worksheets.Item(1)
$sheet.Cells.Item(1, 1) = "Hello from PowerShell"
# $workbook.SaveAs("C:\Temp\Test.xlsx")
# $excel.Quit()

# 清理 COM 对象 (重要!)
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($sheet) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($workbook) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
Remove-Variable excel, workbook, sheet
[GC]::Collect()
[GC]::WaitForPendingFinalizers()
```

**注意**: COM 自动化可能比较复杂且容易出错，尤其是在资源释放方面。

### Active Directory

通过安装 `ActiveDirectory` 模块（通常在域控制器或安装了 RSAT 的机器上可用），可以管理 AD 对象。

```powershell
# 需要先 Import-Module ActiveDirectory (如果未自动加载)
# 或在安装了 RSAT 的机器上运行

# 查找用户
Get-AdUser -Filter 'Name -like "John*"' -Properties EmailAddress, Department
Get-AdUser -Identity jdoe

# 创建新用户
# New-ADUser -Name "Jane Doe" -SamAccountName "jdoe" -GivenName "Jane" -Surname "Doe" -Enabled $true -Path "OU=Users,DC=example,DC=com" -AccountPassword (Read-Host -AsSecureString "Enter password")

# 修改用户属性
Set-ADUser -Identity jdoe -Department "Sales" -Office "New York"

# 获取组成员
Get-AdGroupMember -Identity "Domain Admins"

# 添加用户到组
# Add-ADGroupMember -Identity "Sales Group" -Members jdoe

# 查找计算机
Get-AdComputer -Filter * -SearchBase "OU=Servers,DC=example,DC=com"
```

### REST API

使用 `Invoke-RestMethod` 可以轻松地与 Web API 交互。

```powershell
# 获取 GitHub 用户信息
$user = "microsoft"
$uri = "https://api.github.com/users/$user"
$response = Invoke-RestMethod -Uri $uri
Write-Host "$($response.name) has $($response.public_repos) public repositories."

# 调用需要认证的 API (示例：Bearer Token)
$token = "YOUR_API_TOKEN"
$headers = @{ Authorization = "Bearer $token" }
$apiUri = "https://mysecureapi.com/data"
$data = Invoke-RestMethod -Uri $apiUri -Headers $headers
```

## 错误处理

健壮的脚本需要有效的错误处理机制。

### 错误记录 (`$Error` 变量)

PowerShell 自动将错误记录在 `$Error` 变量中，这是一个包含错误对象的集合（数组）。最新的错误在索引 0 处 (`$Error[0]`)。

```powershell
# 故意产生错误
Get-ChildItem -Path C:\NonExistentFolder

# 查看最近的错误
$Error[0]

# 查看错误详细信息
$Error[0] | Format-List -Force

# 清空错误记录
$Error.Clear()
```

错误对象包含详细信息，如异常类型、错误消息、目标对象、堆栈跟踪等。

### 错误操作首选项 (`$ErrorActionPreference`)

这个变量决定了 PowerShell 遇到非终止性错误时的默认行为。

- **Continue**: (默认值) 显示错误消息并继续执行。
- **SilentlyContinue**: 不显示错误消息，继续执行。错误仍会添加到 `$Error`。
- **Stop**: 显示错误消息并停止执行脚本（将非终止性错误提升为终止性错误）。这是 `Try/Catch` 块捕获错误所必需的。
- **Inquire**: 显示错误消息并提示用户是否继续。
- **Ignore**: (PowerShell 3.0+) 不显示错误消息，不添加到 `$Error`，继续执行。应谨慎使用。

可以在脚本或函数级别设置，或在单个命令上使用 `-ErrorAction` ( `-EA` ) 通用参数。

```powershell
$ErrorActionPreference = 'Stop' # 全局设置
Get-ChildItem -Path C:\NonExistentFolder # 这会停止脚本

# 单个命令覆盖
Get-ChildItem -Path C:\NonExistentFolder -ErrorAction SilentlyContinue
Write-Host "This line will execute even if the above command fails."

# 恢复默认值
$ErrorActionPreference = 'Continue'
```

### Try/Catch/Finally 块

用于捕获和处理 **终止性错误**（或通过 `$ErrorActionPreference = 'Stop'` 或 `-ErrorAction Stop` 提升的非终止性错误）。

```powershell
try {
    # 代码块，可能会产生错误
    $content = Get-Content -Path C:\NonExistentFile.txt -ErrorAction Stop # 确保错误是终止性的
    Write-Host "File content: $content"
}
catch [System.Management.Automation.ItemNotFoundException] {
    # 捕获特定类型的异常
    Write-Warning "File not found: $($_.Exception.Message)"
    # $_ 或 $PSItem 在 catch 块中代表当前的错误记录
}
catch {
    # 捕获所有其他类型的异常 (通用 catch)
    Write-Error "An unexpected error occurred: $($_.Exception.Message)"
    # 可以重新抛出异常: throw $_
}
finally {
    # 无论是否发生错误，总会执行的代码块 (用于清理资源等)
    Write-Host "Cleanup operations here."
}
```

### Throw 语句

用于手动引发一个终止性错误。

```powershell
function Validate-Input {
    param([int]$Value)
    if ($Value -lt 0) {
        throw "Input value cannot be negative. Received: $Value"
    }
    Write-Host "Input $Value is valid."
}

try {
    Validate-Input -Value 10
    Validate-Input -Value -5
}
catch {
    Write-Error "Validation failed: $($_.Exception.Message)"
}
```

### Trap 语句 (较少使用)

`Trap` 是一种较旧的错误处理机制，可以在脚本或函数级别定义一个代码块，用于处理特定类型或所有类型的终止性错误。当错误发生时，控制权转移到 `Trap` 块。

```powershell
function Test-Trap {
    trap [System.DivideByZeroException] {
        Write-Warning "Caught division by zero!"
        continue # 可以使用 continue 或 break 控制 Trap 后的行为
    }
    trap {
        Write-Error "Caught an error: $($_.Exception.Message)"
        # 默认行为类似 break
    }

    Write-Host "Starting calculation..."
    $result = 10 / 0
    Write-Host "This won't be reached if trap doesn't use 'continue'."
    throw "Another error"
}

Test-Trap
```

`Try/Catch` 通常是更推荐的现代错误处理方式，因为它提供了更结构化和灵活的控制。

## 最佳实践

遵循最佳实践可以使你的 PowerShell 脚本更可靠、可读、可维护和安全。

- **命名规范**:
  - 函数/脚本使用批准的动词 (`Get`, `Set`, `New`, `Remove`, `Invoke`, `Test` 等) 和清晰的名词，遵循 `动词-名词` 模式。
  - 变量使用清晰、描述性的名称，通常采用驼峰式 (`$userName`, `$logFilePath`) 或帕斯卡式 (`$UserName`, `$LogFilePath`)。
  - 参数名称使用帕斯卡式 (`-ComputerName`, `-FilePath`)。
- **代码注释和文档**:
  - 使用 `#` 添加行内注释解释复杂逻辑。
  - 使用 `<# ... #>` 块注释提供脚本或函数的摘要、描述、参数说明、示例等（Comment-Based Help），以便 `Get-Help` 可以读取。
- **错误处理策略**:
  - 使用 `Try/Catch/Finally` 处理预期可能发生的错误。
  - 设置合适的 `$ErrorActionPreference` 或使用 `-ErrorAction`。
  - 提供有意义的错误消息。
  - 考虑脚本失败时的回滚或清理操作。
- **模块化设计**:
  - 将可重用的函数组织到模块中。
  - 保持函数和脚本的单一职责。
- **使用详细输出 (`Write-Verbose`)**:
  - 在脚本中添加 `Write-Verbose` 语句来提供执行过程中的详细信息。用户可以通过 `-Verbose` 参数启用这些消息，便于调试和理解脚本行为。
  - 函数需要添加 `[CmdletBinding()]` 才能响应 `-Verbose`。
- **避免使用别名 (在脚本中)**:
  - 在交互式 shell 中使用别名可以提高效率，但在脚本中应使用完整的 Cmdlet 名称，以提高清晰度和可维护性。`ls` 不如 `Get-ChildItem` 清晰。
- **安全性考虑**:
  - 不要在脚本中硬编码凭据。使用 `Get-Credential` 或安全的方式（如 Windows Credential Manager、Azure Key Vault）来处理敏感信息。
  - 注意执行策略，对来自不可信来源的脚本保持警惕。
  - 使用 `SupportsShouldProcess` (`-WhatIf`, `-Confirm`) 来实现可能产生破坏性更改的操作，给用户预览和确认的机会。
  - 验证和清理外部输入。
- **代码格式化**: 保持一致的缩进和代码风格。
- **参数验证**: 使用参数属性 (`[Parameter(Mandatory=$true)]`, `[ValidateSet(...)]`, `[ValidateRange(...)]`, `[ValidatePattern(...)]`) 来验证函数或脚本的输入。
- **管道支持**: 设计函数以接受管道输入 (`ValueFromPipeline`, `ValueFromPipelineByPropertyName`) 并产生可供管道使用的对象输出。

## 总结

PowerShell 是一个功能极其丰富的自动化框架和脚本语言。从简单的命令行任务到复杂的系统管理和跨平台自动化，PowerShell 提供了强大的工具集。通过理解其核心概念（对象、管道、Cmdlet）、掌握常用命令、学习脚本编写技巧、利用模块和远程处理能力，并结合与其他技术的集成，你可以极大地提高工作效率。遵循最佳实践将确保你的脚本健壮、安全且易于维护。随着 PowerShell 的不断发展，它将继续在 IT 自动化和 DevOps 领域扮演关键角色。
