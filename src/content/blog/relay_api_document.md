---
title: newAPI
date: 2025-05-02 09:41:18
author: DDLG
description: "newAPI调用 AI模型 AI接口"
pubDate: 2026-03-21
---

# 中继接口 API 文档

本文档描述了 New API 的中继接口，用于调用各种 AI 模型和相关服务。

## 接口列表

### 聊天 (Chat)

#### OpenAI 格式 (Chat Completions)

**官方文档:** OpenAI Chat

**📝 简介:**

给定一组包含对话的消息列表,模型将返回一个响应。相关指南可参阅 OpenAI 官网:Chat Completions

**💡 请求示例:**

**基础文本对话 ✅**

```
curl https://你的newapi服务器地址/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "你是一个有帮助的助手。" },
      { "role": "user", "content": "你好!" }
    ]
  }'
```

响应示例:

```
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "你好!我很高兴能帮助你。请问有什么我可以协助你的吗?"
    },
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

**图像分析对话 ✅**

```
curl https://你的newapi服务器地址/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "这张图片里有什么?" },
          { "type": "image_url", "image_url": { "url": "https://example.com/image.jpg" } }
        ]
      }
    ],
    "max_tokens": 300
  }'
```

响应示例:

```
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "这张图片展示了一条木制栈道穿过茂密的绿色湿地。栈道似乎延伸到远处,两旁是郁郁葱葱的植被。"
    },
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

**流式响应 ✅**

```
curl https://你的newapi服务器地址/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "user", "content": "讲个故事" }
    ],
    "stream": true
  }'
```

流式响应示例:

```
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"content":"从前"},"logprobs":null,"finish_reason":null}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"content":"有一只"},"logprobs":null,"finish_reason":null}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{"content":"小兔子"},"logprobs":null,"finish_reason":null}]}
// ... 更多数据块 ...
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini","system_fingerprint":"fp_44709d6fcb","choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}
```

**函数调用 ✅**

```
curl https://你的newapi服务器地址/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "user", "content": "北京今天的天气怎么样?" }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "获取指定位置的当前天气",
          "parameters": {
            "type": "object",
            "properties": {
              "location": { "type": "string", "description": "城市名称,如: 北京" },
              "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
            },
            "required": ["location"]
          }
        }
      }
    ],
    "tool_choice": "auto"
  }'
```

响应示例:

```
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1699896916,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"location\": \"北京\", \"unit\": \"celsius\"}"
            }
          }
        ]
      },
      "logprobs": null,
      "finish_reason": "tool_calls"
    }
  ],
  "usage": {
    "prompt_tokens": 82,
    "completion_tokens": 17,
    "total_tokens": 99
  }
}
```

**JSON 模式输出 ✅**

```
curl https://你的newapi服务器地址/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $NEWAPI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "system", "content": "你是一个JSON助手,请以JSON格式回复。" },
      { "role": "user", "content": "给我一个用户信息示例" }
    ],
    "response_format": { "type": "json_object" }
  }'
```

响应示例:

```
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o-mini",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "{\"user\":{\"id\":1,\"name\":\"张三\",\"age\":28,\"email\":\"zhangsan@example.com\",\"interests\":[\"读书\",\"旅游\",\"摄影\"]}}"
    },
    "logprobs": null,
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  }
}
```

**📮 请求:**

**端点:**

```
POST /v1/chat/completions
```

创建给定聊天对话的模型响应。更多详情请参阅文本生成、视觉和音频指南。

**鉴权方法:**

在请求头中包含以下内容进行 API 密钥认证:

```
Authorization: Bearer $NEWAPI_API_KEY
```

其中 $NEWAPI_API_KEY 是您的 API 密钥。您可以在 OpenAI 平台的 API 密钥页面中找到或生成 API 密钥。

**请求体参数:**

- **messages**
  - 类型: 数组
  - 必需: 是
  - 到目前为止包含对话的消息列表。根据使用的模型,支持不同的消息类型(形式),如文本、图像和音频。

- **model**
  - 类型: 字符串
  - 必需: 是
  - 要使用的模型 ID。有关哪些模型适用于 Chat API 的详细信息,请参阅模型端点兼容性表。

- **store**
  - 类型: 布尔值或 null
  - 必需: 否
  - 默认值: false
  - 是否存储此聊天补全请求的输出以用于我们的模型蒸馏或评估产品。

- **reasoning_effort**
  - 类型: 字符串或 null
  - 必需: 否
  - 默认值: medium
  - 仅适用于 o1 和 o3-mini 模型
  - 约束推理模型的推理工作。当前支持的值为 low、medium 和 high。减少推理工作可以加快响应速度并减少响应中用于推理的标记数。

- **metadata**
  - 类型: map
  - 必需: 否
  - 可以附加到对象的 16 个键值对集合。这对于以结构化格式存储对象的其他信息很有用,并可以通过 API 或仪表板查询对象。
  - 键是最大长度为 64 个字符的字符串。值是最大长度为 512 个字符的字符串。

- **modalities**
  - 类型: 数组或 null
  - 必需: 否
  - 您希望模型为此请求生成的输出类型。大多数模型都能生成文本,这是默认设置: ["text"]
  - 该模型还可以用于生成音频。要请求此模型同时生成文本和音频响应,您可以使用: ["text", "audio"]

- **prediction**
  - 类型: 对象
  - 必需: 否
  - 预测输出的配置,当提前知道模型响应的大部分内容时,可以大大提高响应时间。这在您只对文件进行微小更改时最常见。

- **audio**
  - 类型: 对象或 null
  - 必需: 否
  - 音频输出的参数。当使用 modalities: ["audio"] 请求音频输出时需要。

- **temperature**
  - 类型: 数字或 null
  - 必需: 否
  - 默认值: 1
  - 要使用的采样温度,介于 0 和 2 之间。较高的值(如 0.8)会使输出更加随机,而较低的值(如 0.2)会使其更加集中和确定性。我们通常建议更改此值或 top_p,但不要同时更改。

- **top_p**
  - 类型: 数字或 null
  - 必需: 否
  - 默认值: 1
  - 一种替代采样温度的方法,称为核采样,其中模型考虑具有 top_p 概率质量的标记结果。因此,0.1 意味着只考虑包含前 10% 概率质量的标记。
  - 我们通常建议更改此值或 temperature,但不要同时更改。

- **n**
  - 类型: 整数或 null
  - 必需: 否
  - 默认值: 1
  - 为每个输入消息生成多少个聊天补全选择。请注意,您将根据所有选择生成的标记数量收费。保持 n 为 1 可最大限度地降低成本。

- **stop**
  - 类型: 字符串/数组/null
  - 必需: 否
  - 默认值: null
  - API 将停止生成更多标记的最多 4 个序列。

- **max_tokens**
  - 类型: 整数或 null
  - 必需: 否
  - 聊天补全中可以生成的最大标记数。此值可用于控制通过 API 生成的文本成本。
  - 该值现已弃用,取而代之的是 max_completion_tokens,并且与 o1 系列模型不兼容。

- **presence_penalty**
  - 类型: 数字或 null
  - 必需: 否
  - 默认值: 0
  - 介于 -2.0 和 2.0 之间的数字。正值根据新标记到目前为止在文本中出现的情况来惩罚它们,从而增加模型讨论新主题的可能性。

- **frequency_penalty**
  - 类型: 数字或 null
  - 必需: 否
  - 默认值: 0
  - 介于 -2.0 和 2.0 之间的数字。正值根据新标记到目前为止在文本中的现有频率来惩罚它们,从而降低模型逐字重复同一行的可能性。

- **logit_bias**
  - 类型: map
  - 必需: 否
  - 默认值: null
  - 修改指定标记出现在补全中的可能性。
  - 接受一个 JSON 对象,该对象将标记(由分词器中的标记 ID 指定)映射到从 -100 到 100 的关联偏差值。在数学上,偏差被添加到模型在采样之前生成的对数中。确切的效果会因模型而异,但介于 -1 和 1 之间的值应该会减少或增加选择的可能性;像 -100 或 100 这样的值应该导致相关标记被禁止或独占选择。

- **user**
  - 类型: 字符串
  - 必需: 否
  - 表示最终用户的唯一标识符,可以帮助 OpenAI 监控和检测滥用行为。了解更多。

- **service_tier**
  - 类型: 字符串或 null
  - 必需: 否
  - 默认值: auto
  - 指定用于处理请求的延迟层级。此参数与订阅了 scale tier 服务的客户相关:
    - 如果设置为 'auto',且项目启用了 Scale tier,系统将使用 scale tier 信用直到用完
    - 如果设置为 'auto',且项目未启用 Scale tier,请求将使用默认服务层级处理,具有较低的正常运行时间 SLA 且无延迟保证
    - 如果设置为 'default',请求将使用默认服务层级处理,具有较低的正常运行时间 SLA 且无延迟保证
    - 未设置时,默认行为为 'auto'

- **stream_options**
  - 类型: 对象或 null
  - 必需: 否
  - 默认值: null
  - 流式响应的选项。仅在设置 stream: true 时使用。

- **response_format**
  - 类型: 对象
  - 必需: 否
  - 指定模型必须输出的格式。
  - 设置为 { "type": "json_schema", "json_schema": {...} } 启用结构化输出,确保模型将匹配您提供的 JSON schema。
  - 设置为 { "type": "json_object" } 启用 JSON 模式,确保模型生成的消息是有效的 JSON。
  - 重要提示:使用 JSON 模式时,您还必须通过系统或用户消息自行指示模型生成 JSON。否则,模型可能会生成无尽的空白直到生成达到令牌限制。

- **seed**
  - 类型: 整数或 null
  - 必需: 否
  - Beta 功能。如果指定,我们的系统将尽最大努力进行确定性采样,使得具有相同 seed 和参数的重复请求应返回相同的结果。不保证确定性,您应参考响应参数以监控后端的变化。

- **tools**
  - 类型: 数组
  - 必需: 否
  - 模型可能调用的工具列表。目前仅支持函数作为工具。使用此参数提供模型可能生成 JSON 输入的函数列表。最多支持 128 个函数。

- **tool_choice**
  - 类型: 字符串或对象
  - 必需: 否
  - 控制模型调用哪个工具(如果有):
    - none: 模型不会调用任何工具,而是生成消息
    - auto: 模型可以在生成消息或调用一个或多个工具之间选择
    - required: 模型必须调用一个或多个工具
    - {"type": "function", "function": {"name": "my_function"}}: 强制模型调用特定工具
  - 当没有工具时默认为 none,有工具时默认为 auto。

- **parallel_tool_calls**
  - 类型: 布尔值
  - 必需: 否
  - 默认值: true
  - 是否在工具使用期间启用并行函数调用。

**📥 响应:**

**成功响应:**

返回一个聊天补全对象,如果请求被流式传输,则返回聊天补全块对象的流式序列。

- **id**
  - 类型: 字符串
  - 说明: 响应的唯一标识符

- **object**
  - 类型: 字符串
  - 说明: 对象类型,值为 "chat.completion"

- **created**
  - 类型: 整数
  - 说明: 响应创建时间戳

- **model**
  - 类型: 字符串
  - 说明: 使用的模型名称

- **system_fingerprint**
  - 类型: 字符串
  - 说明: 系统指纹标识符

- **choices**
  - 类型: 数组
  - 说明: 包含生成的回复选项
  - 属性:
    - index: 选项索引
    - message: 包含角色和内容的消息对象
    - logprobs: 日志概率信息
    - finish_reason: 完成原因

- **usage**
  - 类型: 对象
  - 说明: token 使用统计
  - 属性:
    - prompt_tokens: 提示使用的 token 数
    - completion_tokens: 补全使用的 token 数
    - total_tokens: 总 token 数
    - completion_tokens_details: token 详细信息

#### Anthropic 格式 (Messages)

**官方文档:**

- Anthropic Messages
- Anthropic Streaming Messages

**📝 简介:**

给定一组包含文本和/或图像内容的结构化输入消息列表,模型将生成对话中的下一条消息。Messages API 可用于单次查询或无状态的多轮对话。

**💡 请求示例:**

**基础文本对话 ✅**

```
curl https://你的newapi服务器地址/v1/messages \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $NEWAPI_API_KEY" \
  --data \
  '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, world"}
    ]
  }'
```

响应示例:

```
{
  "content": [
    {
      "text": "Hi! My name is Claude.",
      "type": "text"
    }
  ],
  "id": "msg_013Zva2CMHLNnXjNJKqJ2EF",
  "model": "claude-3-5-sonnet-20241022",
  "role": "assistant",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "type": "message",
  "usage": {
    "input_tokens": 2095,
    "output_tokens": 503
  }
}
```

**图像分析对话 ✅**

```
curl https://你的newapi服务器地址/v1/messages \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $NEWAPI_API_KEY" \
  --data \
  '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "image", "source": { "type": "base64", "media_type": "image/jpeg", "data": "/9j/4AAQSkZJRg..." } },
          { "type": "text", "text": "这张图片里有什么?" }
        ]
      }
    ]
  }'
```

响应示例:

```
{
  "content": [
    {
      "text": "这张图片显示了一只橙色的猫咪正在窗台上晒太阳。猫咪看起来很放松,眯着眼睛享受阳光。窗外可以看到一些绿色的植物。",
      "type": "text"
    }
  ],
  "id": "msg_013Zva2CMHLNnXjNJKqJ2EF",
  "model": "claude-3-5-sonnet-20241022",
  "role": "assistant",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "type": "message",
  "usage": {
    "input_tokens": 3050,
    "output_tokens": 892
  }
}
```

**工具调用 ✅**

```
curl https://你的newapi服务器地址/v1/messages \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $NEWAPI_API_KEY" \
  --data \
  '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [
      { "role": "user", "content": "今天北京的天气怎么样?" }
    ],
    "tools": [
      {
        "name": "get_weather",
        "description": "获取指定位置的当前天气",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": { "type": "string", "description": "城市名称,如:北京" }
          },
          "required": ["location"]
        }
      }
    ]
  }'
```

响应示例:

```
{
  "content": [
    {
      "type": "tool_use",
      "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
      "name": "get_weather",
      "input": { "location": "北京" }
    }
  ],
  "id": "msg_013Zva2CMHLNnXjNJKqJ2EF",
  "model": "claude-3-5-sonnet-20241022",
  "role": "assistant",
  "stop_reason": "tool_use",
  "stop_sequence": null,
  "type": "message",
  "usage": {
    "input_tokens": 2156,
    "output_tokens": 468
  }
}
```

**流式响应 ✅**

```
curl https://你的newapi服务器地址/v1/messages \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $NEWAPI_API_KEY" \
  --data \
  '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [
      { "role": "user", "content": "讲个故事" }
    ],
    "stream": true
  }'
```

响应示例:

```
{ "type": "message_start", "message": { "id": "msg_013Zva2CMHLNnXjNJKqJ2EF", "model": "claude-3-5-sonnet-20241022", "role": "assistant", "type": "message" } }
{ "type": "content_block_start", "index": 0, "content_block": { "type": "text" } }
{ "type": "content_block_delta", "index": 0, "delta": { "text": "从前" } }
{ "type": "content_block_delta", "index": 0, "delta": { "text": "有一只" } }
{ "type": "content_block_delta", "index": 0, "delta": { "text": "小兔子..." } }
{ "type": "content_block_stop", "index": 0 }
{ "type": "message_delta", "delta": { "stop_reason": "end_turn", "usage": { "input_tokens": 2045, "output_tokens": 628 } } }
{ "type": "message_stop" }
```

**📮 请求:**

**端点:**

```
POST /v1/messages
```

**鉴权方法:**

在请求头中包含以下内容进行 API 密钥认证:

```
x-api-key: $NEWAPI_API_KEY
```

其中 $NEWAPI_API_KEY 是您的 API 密钥。您可以通过控制台获取 API 密钥,每个密钥仅限于一个工作区使用。

**请求头参数:**

- **anthropic-beta**
  - 类型: 字符串
  - 必需: 否
  - 指定要使用的 beta 版本,支持用逗号分隔的列表如 beta1,beta2,或多次指定该请求头。

- **anthropic-version**
  - 类型: 字符串
  - 必需: 是
  - 指定要使用的 API 版本。

**请求体参数:**

- **max_tokens**
  - 类型: 整数
  - 必需: 是
  - 生成的最大 token 数量。不同模型有不同的限制,详见模型文档。范围 x > 1。

- **messages**
  - 类型: 对象数组
  - 必需: 是
  - 输入消息列表。模型被训练为在用户和助手之间交替进行对话。创建新消息时,您可以使用 messages 参数指定之前的对话轮次,模型将生成对话中的下一条消息。连续的用户或助手消息会被合并为单个轮次。
  - 每个消息必须包含 role 和 content 字段。您可以指定单个用户角色消息,或包含多个用户和助手消息。如果最后一条消息使用助手角色,响应内容将直接从该消息的内容继续,这可以用来约束模型的响应。
  - 单条用户消息示例:
    ```
    [{"role": "user", "content": "Hello, Claude"}]
    ```
  - 多轮对话示例:
    ```
    [ {"role": "user", "content": "你好。"}, {"role": "assistant", "content": "你好!我是 Claude。有什么可以帮你的吗?"}, {"role": "user", "content": "请用简单的话解释什么是 LLM?"} ]
    ```
  - 部分填充的响应示例:
    ```
    [ {"role": "user", "content": "太阳的希腊语名字是什么? (A) Sol (B) Helios (C) Sun"}, {"role": "assistant", "content": "正确答案是 ("} ]
    ```
  - 每个消息的 content 可以是字符串或内容块数组。使用字符串相当于一个 "text" 类型的内容块数组的简写。以下两种写法等效:
    ```
    {"role": "user", "content": "Hello, Claude"}
    ```
    ```
    { "role": "user", "content": [{"type": "text", "text": "Hello, Claude"}] }
    ```
  - 从 Claude 3 模型开始,您还可以发送图片内容块:
    ```
    { "role": "user", "content": [ { "type": "image", "source": { "type": "base64", "media_type": "image/jpeg", "data": "/9j/4AAQSkZJRg..." } }, { "type": "text", "text": "这张图片里有什么?" } ] }
    ```
  - > 目前支持的图片格式包括: base64, image/jpeg、image/png、image/gif 和 image/webp。

  - ##### messages.role
    - 类型: 枚举字符串
    - 必需: 是
    - 可选值: user, assistant
    - 注意: Messages API 中没有 "system" 角色,如果需要系统提示,请使用顶层的 system 参数。

  - ##### messages.content
    - 类型: 字符串或对象数组
    - 必需: 是
    - 消息内容可以是以下几种类型之一:

    - ###### 文本内容 (Text)

      ```
      {
        "type": "text", // 必需,枚举值: "text"
        "text": "Hello, Claude", // 必需,最小长度: 1
        "cache_control": {
          "type": "ephemeral" // 可选,枚举值: "ephemeral"
        }
      }
      ```

    - ###### 图片内容 (Image)

      ```
      {
        "type": "image", // 必需,枚举值: "image"
        "source": { // 必需
          "type": "base64", // 必需,枚举值: "base64"
          "media_type": "image/jpeg", // 必需,支持: image/jpeg, image/png, image/gif, image/webp
          "data": "/9j/4AAQSkZJRg..." // 必需,base64 编码的图片数据
        },
        "cache_control": {
          "type": "ephemeral" // 可选,枚举值: "ephemeral"
        }
      }
      ```

    - ###### 工具使用 (Tool Use)

      ```
      {
        "type": "tool_use", // 必需,枚举值: "tool_use",默认值
        "id": "toolu_xyz...", // 必需,工具使用的唯一标识符
        "name": "get_weather", // 必需,工具名称,最小长度: 1
        "input": { // 必需,工具的输入参数对象
          // 工具输入参数,具体格式由工具的 input_schema 定义
        },
        "cache_control": {
          "type": "ephemeral" // 可选,枚举值: "ephemeral"
        }
      }
      ```

    - ###### 工具结果 (Tool Result)

      ```
      {
        "type": "tool_result", // 必需,枚举值: "tool_result"
        "tool_use_id": "toolu_xyz...", // 必需
        "content": "结果内容", // 必需,可以是字符串或内容块数组
        "is_error": false, // 可选,布尔值
        "cache_control": {
          "type": "ephemeral" // 可选,枚举值: "ephemeral"
        }
      }
      ```

      当 content 为内容块数组时,每个内容块可以是文本或图片:

      ```
      {
        "type": "tool_result",
        "tool_use_id": "toolu_xyz...",
        "content": [
          {
            "type": "text", // 必需,枚举值: "text"
            "text": "分析结果", // 必需,最小长度: 1
            "cache_control": {
              "type": "ephemeral" // 可选,枚举值: "ephemeral"
            }
          },
          {
            "type": "image", // 必需,枚举值: "image"
            "source": { // 必需
              "type": "base64", // 必需,枚举值: "base64"
              "media_type": "image/jpeg",
              "data": "..."
            },
            "cache_control": {
              "type": "ephemeral"
            }
          }
        ]
      }
      ```

    - ###### 文档 (Document)
      ```
      {
        "type": "document", // 必需,枚举值: "document"
        "source": { // 必需
          // 文档源数据
        },
        "cache_control": {
          "type": "ephemeral" // 可选,枚举值: "ephemeral"
        }
      }
      ```
    - 注意: 1. 每种类型都可以包含可选的 cache_control 字段,用于控制内容的缓存行为 2. 文本内容的最小长度为 1 3. 所有类型的 type 字段都是必需的枚举字符串 4. 工具结果的 content 字段支持字符串或包含文本/图片的内容块数组

- **model**
  - 类型: 字符串
  - 必需: 是
  - 要使用的模型名称,详见模型文档。范围 1 - 256 个字符。

- **metadata**
  - 类型: 对象
  - 必需: 否
  - 描述请求元数据的对象。包含以下可选字段:
  - user_id: 与请求关联的用户的外部标识符。应该是 uuid、哈希值或其他不透明标识符。不要包含任何标识信息如姓名、邮箱或电话号码。最大长度:256。

- **stop_sequences**
  - 类型: 字符串数组
  - 必需: 否
  - 自定义的停止生成的文本序列。

- **stream**
  - 类型: 布尔值
  - 必需: 否
  - 是否使用服务器发送事件 (SSE) 来增量返回响应内容。

- **system**
  - 类型: 字符串
  - 必需: 否
  - 系统 prompt,为 Claude 提供背景和指令。这是一种为模型提供上下文和特定目标或角色的方式。注意这与消息中的 role 不同,Messages API 中没有 "system" 角色。

- **temperature**
  - 类型: 数字
  - 必需: 否
  - 默认值: 1.0
  - 控制生成随机性,0.0 - 1.0。范围 0 < x < 1。建议对于分析性/选择题类任务使用接近 0.0 的值,对于创造性和生成性任务使用接近 1.0 的值。
  - 注意:即使 temperature 设置为 0.0,结果也不会完全确定。

- **🆕 thinking**
  - 类型: 对象
  - 必需: 否
  - 配置 Claude 的扩展思考功能。启用时,响应将包含展示 Claude 在给出最终答案前的思考过程的内容块。需要至少 1,024 个 token 的预算,并计入您的 max_tokens 限制。
  - 可以设置为以下两种模式之一:

  - ##### 1. 启用模式

    ```
    {
      "type": "enabled",
      "budget_tokens": 2048
    }
    ```

    - type: 必需,枚举值: "enabled"
    - budget_tokens: 必需,整数。决定 Claude 可以用于内部推理过程的 token 数量。更大的预算可以让模型对复杂问题进行更深入的分析,提高响应质量。必须 ≥1024 且小于 max_tokens。范围 x > 1024。

  - ##### 2. 禁用模式
    ```
    {
      "type": "disabled"
    }
    ```

    - type: 必需,枚举值: "disabled"

- **tool_choice**
  - 类型: 对象
  - 必需: 否
  - 控制模型如何使用提供的工具。可以是以下三种类型之一:

  - ##### 1. Auto 模式 (自动选择)

    ```
    {
      "type": "auto", // 必需,枚举值: "auto"
      "disable_parallel_tool_use": false // 可选,默认 false。如果为 true,模型最多只会使用一个工具
    }
    ```

  - ##### 2. Any 模式 (任意工具)

    ```
    {
      "type": "any", // 必需,枚举值: "any"
      "disable_parallel_tool_use": false // 可选,默认 false。如果为 true,模型将恰好使用一个工具
    }
    ```

  - ##### 3. Tool 模式 (指定工具)
    ```
    {
      "type": "tool", // 必需,枚举值: "tool"
      "name": "get_weather", // 必需,指定要使用的工具名称
      "disable_parallel_tool_use": false // 可选,默认 false。如果为 true,模型将恰好使用一个工具
    }
    ```
  - 注意: 1. Auto 模式:模型可以自行决定是否使用工具 2. Any 模式:模型必须使用工具,但可以选择任何可用的工具 3. Tool 模式:模型必须使用指定的工具

- **tools**
  - 类型: 对象数组
  - 必需: 否
  - 定义模型可能使用的工具。工具可以是自定义工具或内置工具类型:

  - ##### 1. 自定义工具(Tool)

    每个自定义工具定义包含:
    - type: 可选,枚举值: "custom"
    - name: 工具名称,必需,1-64 个字符
    - description: 工具描述,建议尽可能详细
    - input_schema: 工具输入的 JSON Schema 定义,必需
    - cache_control: 缓存控制,可选,type 为 "ephemeral"
    - 示例:
      ```
      [
        {
          "type": "custom",
          "name": "get_weather",
          "description": "获取指定位置的当前天气",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": { "type": "string", "description": "城市名称,如:北京" }
            },
            "required": ["location"]
          }
        }
      ]
      ```

  - ##### 2. 计算机工具 (ComputerUseTool)

    ```
    {
      "type": "computer_20241022", // 必需
      "name": "computer", // 必需,枚举值: "computer"
      "display_width_px": 1024, // 必需,显示宽度(像素)
      "display_height_px": 768, // 必需,显示高度(像素)
      "display_number": 0, // 可选,X11 显示编号
      "cache_control": {
        "type": "ephemeral" // 可选
      }
    }
    ```

  - ##### 3. Bash 工具 (BashTool)

    ```
    {
      "type": "bash_20241022", // 必需
      "name": "bash", // 必需,枚举值: "bash"
      "cache_control": {
        "type": "ephemeral" // 可选
      }
    }
    ```

  - ##### 4. 文本编辑器工具 (TextEditor)
    ```
    {
      "type": "text_editor_20241022", // 必需
      "name": "str_replace_editor", // 必需,枚举值: "str_replace_editor"
      "cache_control": {
        "type": "ephemeral" // 可选
      }
    }
    ```
  - 当模型使用工具时,会返回 tool_use 内容块:
    ```
    [
      {
        "type": "tool_use",
        "id": "toolu_01D7FLrfh4GYq7yT1UL
    ```

```

#### Deepseek reasoning 格式（类Chat Completions）

**官方文档:** 推理模型 (deepseek-reasoner)

**📝 简介:**

Deepseek-reasoner 是 DeepSeek 推出的推理模型。在输出最终回答之前,模型会先输出一段思维链内容,以提升最终答案的准确性。API 向用户开放 deepseek-reasoner 思维链的内容,以供用户查看、展示、蒸馏使用。

**💡 请求示例:**

**基础文本对话 ✅**

```

curl https://api.deepseek.com/v1/chat/completions \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $NEWAPI_API_KEY" \
 -d '{
"model": "deepseek-reasoner",
"messages": [
{ "role": "user", "content": "9.11 and 9.8, which is greater?" }
],
"max_tokens": 4096
}'

```

响应示例:

```

{
"id": "chatcmpl-123",
"object": "chat.completion",
"created": 1677652288,
"model": "deepseek-reasoner",
"choices": [{
"index": 0,
"message": {
"role": "assistant",
"reasoning_content": "让我一步步思考:\n1. 我们需要比较 9.11 和 9.8 的大小\n2. 两个数都是小数,我们可以直接比较\n3. 9.8 = 9.80\n4. 9.11 < 9.80\n5. 所以 9.8 更大",
"content": "9.8 is greater than 9.11."
},
"finish_reason": "stop"
}],
"usage": {
"prompt_tokens": 10,
"completion_tokens": 15,
"total_tokens": 25
}
}

```

**流式响应 ✅**

```

curl https://api.deepseek.com/v1/chat/completions \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $NEWAPI_API_KEY" \
 -d '{
"model": "deepseek-reasoner",
"messages": [
{ "role": "user", "content": "9.11 and 9.8, which is greater?" }
],
"stream": true
}'

```

流式响应示例:

```

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"deepseek-reasoner","choices":[{"index":0,"delta":{"role":"assistant","reasoning_content":"让我"},"finish_reason":null}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"deepseek-reasoner","choices":[{"index":0,"delta":{"reasoning_content":"一步步"},"finish_reason":null}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"deepseek-reasoner","choices":[{"index":0,"delta":{"reasoning_content":"思考:"},"finish_reason":null}]}
// ... 更多思维链内容 ...
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"deepseek-reasoner","choices":[{"index":0,"delta":{"content":"9.8"},"finish_reason":null}]}
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"deepseek-reasoner","choices":[{"index":0,"delta":{"content":" is greater"},"finish_reason":null}]}
// ... 更多最终答案内容 ...
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"deepseek-reasoner","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

```

**📮 请求:**

**端点:**

```

POST /v1/chat/completions

```

**鉴权方法:**

在请求头中包含以下内容进行 API 密钥认证:

```

Authorization: Bearer $NEWAPI_API_KEY

```

其中 $DEEPSEEK\_API\_KEY 是您的 API 密钥。

**请求体参数:**

*   **messages**
    *   类型: 数组
    *   必需: 是
    *   到目前为止包含对话的消息列表。请注意,如果您在输入的 messages 序列中传入了 reasoning\_content,API 会返回 400 错误。

*   **model**
    *   类型: 字符串
    *   必需: 是
    *   值: deepseek-reasoner
    *   要使用的模型 ID。目前仅支持 deepseek-reasoner。

*   **max\_tokens**
    *   类型: 整数
    *   必需: 否
    *   默认值: 4096
    *   最大值: 8192
    *   最终回答的最大长度(不含思维链输出)。请注意,思维链的输出最多可以达到 32K tokens。

*   **stream**
    *   类型: 布尔值
    *   必需: 否
    *   默认值: false
    *   是否使用流式响应。

**不支持的参数:**

以下参数当前不支持:

*   temperature
*   top\_p
*   presence\_penalty
*   frequency\_penalty
*   logprobs
*   top\_logprobs

注意: 为了兼容已有软件,设置 temperature、top\_p、presence\_penalty、frequency\_penalty 参数不会报错,但也不会生效。设置 logprobs、top\_logprobs 会报错。

**支持的功能:**

*   对话补全
*   对话前缀续写 (Beta)

**不支持的功能:**

*   Function Call
*   Json Output
*   FIM 补全 (Beta)

**📥 响应:**

**成功响应:**

返回一个聊天补全对象,如果请求被流式传输,则返回聊天补全块对象的流式序列。

*   **id**
    *   类型: 字符串
    *   说明: 响应的唯一标识符

*   **object**
    *   类型: 字符串
    *   说明: 对象类型,值为 "chat.completion"

*   **created**
    *   类型: 整数
    *   说明: 响应创建时间戳

*   **model**
    *   类型: 字符串
    *   说明: 使用的模型名称,值为 "deepseek-reasoner"

*   **choices**
    *   类型: 数组
    *   说明: 包含生成的回复选项
    *   属性:
        *   index: 选项索引
        *   message: 包含角色、思维链内容和最终回答的消息对象
            *   role: 角色,值为 "assistant"
            *   reasoning\_content: 思维链内容
            *   content: 最终回答内容
        *   finish\_reason: 完成原因

*   **usage**
    *   类型: 对象
    *   说明: token 使用统计
    *   属性:
        *   prompt\_tokens: 提示使用的 token 数
        *   completion\_tokens: 补全使用的 token 数
        *   total\_tokens: 总 token 数

**📝 上下文拼接说明:**

在每一轮对话过程中,模型会输出思维链内容(reasoning\_content)和最终回答(content)。在下一轮对话中,之前轮输出的思维链内容不会被拼接到上下文中,如下图所示:

注意

如果您在输入的 messages 序列中,传入了reasoning\_content,API 会返回 400 错误。因此,请删除 API 响应中的 reasoning\_content 字段,再发起 API 请求,方法如下方使用示例所示。

使用示例:

```

from openai import OpenAI

client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")

# 第一轮对话

messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
response = client.chat.completions.create(
model="deepseek-reasoner",
messages=messages
)
reasoning_content = response.choices[0].message.reasoning_content
content = response.choices[0].message.content

# 第二轮对话 - 只拼接最终回答 content

messages.append({'role': 'assistant', 'content': content})
messages.append({'role': 'user', 'content': "How many Rs are there in the word 'strawberry'?"})
response = client.chat.completions.create(
model="deepseek-reasoner",
messages=messages
)

```

流式响应示例:

```

# 第一轮对话

messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]
response = client.chat.completions.create(
model="deepseek-reasoner",
messages=messages,
stream=True
)
reasoning_content = ""
content = ""
for chunk in response:
if chunk.choices[0].delta.reasoning_content:
reasoning_content += chunk.choices[0].delta.reasoning_content
else:
content += chunk.choices[0].delta.content

# 第二轮对话 - 只拼接最终回答 content

messages.append({"role": "assistant", "content": content})
messages.append({'role': 'user', 'content': "How many Rs are there in the word 'strawberry'?"})
response = client.chat.completions.create(
model="deepseek-reasoner",
messages=messages,
stream=True
)

```

### 嵌入 (Embeddings)

**官方文档:** OpenAI Embeddings

**📝 简介:**

获取给定输入文本的向量表示,这些向量可以被机器学习模型和算法轻松使用。相关指南请参阅 Embeddings Guide。

需要注意的是:

*   某些模型可能对输入的总 token 数有限制
*   您可以使用示例 Python 代码来计算 token 数量
*   例如:text-embedding-ada-002 模型的输出向量维度为 1536

**💡 请求示例:**

**创建文本嵌入 ✅**

```

curl https://你的 newapi 服务器地址/v1/embeddings \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $NEWAPI_API_KEY" \
 -d '{
"input": "The food was delicious and the waiter...",
"model": "text-embedding-ada-002",
"encoding_format": "float"
}'

```

响应示例:

```

{
"object": "list",
"data": [
{
"object": "embedding",
"embedding": [
0.0023064255,
-0.009327292,
// ... (1536 个浮点数,用于 ada-002)
-0.0028842222
],
"index": 0
}
],
"model": "text-embedding-ada-002",
"usage": {
"prompt_tokens": 8,
"total_tokens": 8
}
}

```

**批量创建嵌入 ✅**

```

curl https://你的 newapi 服务器地址/v1/embeddings \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $NEWAPI_API_KEY" \
 -d '{
"input": ["The food was delicious", "The waiter was friendly"],
"model": "text-embedding-ada-002",
"encoding_format": "float"
}'

```

响应示例:

```

{
"object": "list",
"data": [
{
"object": "embedding",
"embedding": [
0.0023064255,
// ... (1536 个浮点数)
],
"index": 0
},
{
"object": "embedding",
"embedding": [
-0.008815289,
// ... (1536 个浮点数)
],
"index": 1
}
],
"model": "text-embedding-ada-002",
"usage": {
"prompt_tokens": 12,
"total_tokens": 12
}
}

```

**📮 请求:**

**端点:**

```

POST /v1/embeddings

```

创建表示输入文本的嵌入向量。

**鉴权方法:**

在请求头中包含以下内容进行 API 密钥认证:

```

Authorization: Bearer $NEWAPI_API_KEY

```

其中 $OPENAI\_API\_KEY 是您的 API 密钥。

**请求体参数:**

*   **input**
    *   类型: 字符串或数组
    *   必需: 是
    *   要嵌入的输入文本,编码为字符串或 token 数组。要在单个请求中嵌入多个输入,请传递字符串数组或 token 数组的数组。输入不得超过模型的最大输入 token 数(text-embedding-ada-002 为 8192 个 token),不能为空字符串,任何数组的维度必须小于等于 2048。

*   **model**
    *   类型: 字符串
    *   必需: 是
    *   要使用的模型 ID。您可以使用 List models API 查看所有可用模型,或查看模型概述了解它们的描述。

*   **encoding\_format**
    *   类型: 字符串
    *   必需: 否
    *   默认值: float
    *   返回嵌入的格式。可以是 float 或 base64。

*   **dimensions**
    *   类型: 整数
    *   必需: 否
    *   生成的输出嵌入应具有的维度数。仅在 text-embedding-3 及更高版本的模型中支持。

*   **user**
    *   类型: 字符串
    *   必需: 否
    *   代表您的最终用户的唯一标识符,可以帮助 OpenAI 监控和检测滥用行为。了解更多。

**📥 响应:**

**成功响应:**

返回嵌入对象列表。

*   **object**
    *   类型: 字符串
    *   说明: 对象类型,值为 "list"

*   **data**
    *   类型: 数组
    *   说明: 包含嵌入对象的数组
    *   属性:
        *   object: 对象类型,值为 "embedding"
        *   embedding: 嵌入向量,浮点数列表。向量长度取决于模型
        *   index: 嵌入在列表中的索引

*   **model**
    *   类型: 字符串
    *   说明: 使用的模型名称

*   **usage**
    *   类型: 对象
    *   说明: token 使用统计
    *   属性:
        *   prompt\_tokens: 提示使用的 token 数
        *   total\_tokens: 总 token 数

**嵌入对象:**

表示由嵌入端点返回的嵌入向量。

```

{
"object": "embedding",
"embedding": [
0.0023064255,
-0.009327292,
// ... (ada-002 总共 1536 个浮点数)
-0.0028842222
],
"index": 0
}

```

*   **index**
    *   类型: 整数
    *   说明: 嵌入在列表中的索引

*   **embedding**
    *   类型: 数组
    *   说明: 嵌入向量,浮点数列表。向量长度取决于模型,具体请参阅嵌入指南

*   **object**
    *   类型: 字符串
    *   说明: 对象类型,始终为 "embedding"

**错误响应:**

当请求出现问题时,API 将返回一个错误响应对象,HTTP 状态码在 4XX-5XX 范围内。

**常见错误状态码:**

*   401 Unauthorized: API 密钥无效或未提供
*   400 Bad Request: 请求参数无效,例如输入为空或超出 token 限制
*   429 Too Many Requests: 超出 API 调用限制
*   500 Internal Server Error: 服务器内部错误

错误响应示例:

```

{
"error": {
"message": "The input exceeds the maximum length. Please reduce the length of your input.",
"type": "invalid_request_error",
"param": "input",
"code": "context_length_exceeded"
}
}

```

### 重排序 (Rerank)

**官方文档:** Jina AI Rerank

标准格式

在New API中,Jina AI的rerank格式被采用为标准格式。所有其他供应商(如Xinference、Cohere等)的rerank响应都会被格式化为Jina AI的格式,以提供统一的开发体验。

**📝 简介:**

Jina AI Rerank 是一个强大的文本重排序模型,可以根据查询对文档列表进行相关性排序。该模型支持多语言,可以处理不同语言的文本内容,并为每个文档分配相关性分数。

**💡 请求示例:**

**基础重排序请求 ✅**

```

curl https://你的 newapi 服务器地址/v1/rerank \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer $NEWAPI_API_KEY" \
 -d '{
"model": "jina-reranker-v2-base-multilingual",
"query": "Organic skincare products for sensitive skin",
"top_n": 3,
"documents": [
"Organic skincare for sensitive skin with aloe vera and chamomile...",
"New makeup trends focus on bold colors and innovative techniques...",
"Bio-Hautpflege für empfindliche Haut mit Aloe Vera und Kamille..."
]
}'

```

响应示例:

```

{
"results": [
{
"document": {
"text": "Organic skincare for sensitive skin with aloe vera and chamomile..."
},
"index": 0,
"relevance_score": 0.8783142566680908
},
{
"document": {
"text": "Bio-Hautpflege für empfindliche Haut mit Aloe Vera und Kamille..."
},
"index": 2,
"relevance_score": 0.7624675869941711
}
],
"usage": {
"prompt_tokens": 815,
"completion_tokens": 0,
"total_tokens": 815
}
}

```

**📮 请求:**

**端点:**

```

POST /v1/rerank

```

**鉴权方法:**

在请求头中包含以下内容进行 API 密钥认证:

```

Authorization: Bearer $NEWAPI_API_KEY

```

其中 $NEWAPI\_API\_KEY 是您的 API 密钥。

**请求体参数:**

*   **model**
    *   类型: 字符串
    *   必需: 否
    *   默认值: jina-reranker-v2-base-multilingual
    *   说明: 要使用的重排序模型

*   **query**
    *   类型: 字符串
    *   必需: 是
    *   说明: 用于对文档进行相关性排序的查询文本

*   **top\_n**
    *   类型: 整数
    *   必需: 否
    *   默认值: 无限制
    *   说明: 返回排序后的前 N 个文档

*   **documents**
    *   类型: 字符串数组
    *   必需: 是
    *   说明: 要进行重排序的文档列表
    *   限制: 每个文档的长度不应超过模型的最大token限制

**📥 响应:**

**成功响应:**

*   **results**
    *   类型: 数组
    *   说明: 重排序后的文档列表
    *   属性:
        *   document: 包含文档文本的对象
        *   index: 文档在原始列表中的索引
        *   relevance\_score: 相关性分数(0-1之间)

*   **usage**
    *   类型: 对象
    *   说明: token 使用统计
    *   属性:
        *   prompt\_tokens: 提示使用的 token 数
        *   completion\_tokens: 补全使用的 token 数
        *   total\_tokens: 总 token 数
        *   prompt\_tokens\_details: 提示 token 详细信息
            *   cached\_tokens: 缓存的 token 数
            *   audio\_tokens: 音频 token 数
        *   completion\_tokens\_details: 补全 token 详细信息
            *   reasoning\_tokens: 推理 token 数
            *   audio\_tokens: 音频 token 数
            *   accepted\_prediction\_tokens: 接受的预测 token 数
            *   rejected\_prediction\_tokens: 拒绝的预测 token 数

**错误响应:**

当请求出现问题时,API 将返回错误响应:

*   400 Bad Request: 请求参数无效
*   401 Unauthorized: API 密钥无效或未提供
*   429 Too Many Requests: 请求频率超限
*   500 Internal Server Error: 服务器内部错误

**💡 最佳实践:**

### 查询优化建议¶

1.  使用清晰具体的查询文本
2.  避免过于宽泛或模糊的查询
3.  确保查询与文档使用相同的语言风格

### 文档处理建议¶

1.  保持文档长度适中,不要超过模型限制
2.  确保文档内容完整且有意义
3.  可以包含多语言文档,模型支持跨语言匹配

### 性能优化¶

1.  合理设置 top\_n 参数以减少不必要的计算
2.  对于大量文档,考虑分批处理
3.  可以缓存常用查询的结果

### 多语言支持¶

该模型支持多种语言的文档重排序,包括但不限于:

*   英语
*   中文
*   德语
*   西班牙语
*   日语
*   法语

无需指定语言参数,模型会自动识别和处理不同语言的内容。

### 实时对话 (Realtime)

OpenAI 格式 - New API Docs

跳转至

在 GitHub 上关注我们的最新动态或加入我们的 QQ 交流群

# OpenAI 实时对话接口¶

官方文档

* OpenAI Realtime WebRTC
* OpenAI Realtime WebSocket

## 📝 概述¶

### 简介¶

OpenAI Realtime API 提供两种连接方式:

1. WebRTC - 适用于浏览器和移动客户端的实时音视频交互
2. WebSocket - 适用于服务器到服务器的应用程序集成

### 使用场景¶

* 实时语音对话
* 音视频会议
* 实时翻译
* 语音转写
* 实时代码生成
* 服务器端实时集成

### 主要特性¶

* 双向音频流传输
* 文本和音频混合对话
* 函数调用支持
* 自动语音检测(VAD)
* 音频转写功能
* WebSocket 服务器端集成

## 🔐 认证与安全¶

### 认证方式¶

1. 标准 API 密钥 (仅服务器端使用)
2. 临时令牌 (客户端使用)

### 临时令牌¶

* 有效期: 1分钟
* 使用限制: 单个连接
* 获取方式: 通过服务器端 API 创建

```

POST https://你的 newapi 服务器地址/v1/realtime/sessions Content-Type: application/json Authorization: Bearer $NEW_API_KEY { "model": "gpt-4o-realtime-preview-2024-12-17", "voice": "verse" }

```

### 安全建议¶

* 永远不要在客户端暴露标准 API 密钥
* 使用 HTTPS/WSS 进行通信
* 实现适当的访问控制
* 监控异常活动

## 🔌 连接建立¶

### WebRTC 连接¶

* URL: https://你的newapi服务器地址/v1/realtime
* 查询参数: model
* 请求头:
* Authorization: Bearer EPHEMERAL\_KEY
* Content-Type: application/sdp

### WebSocket 连接¶

* URL: wss://你的newapi服务器地址/v1/realtime
* 查询参数: model
* 请求头:
* Authorization: Bearer YOUR\_API\_KEY
* OpenAI-Beta: realtime=v1

### 连接流程¶

```

sequenceDiagram participant Client participant Server participant OpenAI alt WebRTC 连接 Client->>Server: 请求临时令牌 Server->>OpenAI: 创建会话 OpenAI-->>Server: 返回临时令牌 Server-->>Client: 返回临时令牌 Client->>OpenAI: 创建 WebRTC offer OpenAI-->>Client: 返回 answer Note over Client,OpenAI: 建立 WebRTC 连接 Client->>OpenAI: 创建数据通道 OpenAI-->>Client: 确认数据通道 else WebSocket 连接 Server->>OpenAI: 建立 WebSocket 连接 OpenAI-->>Server: 确认连接 Note over Server,OpenAI: 开始实时对话 end

```

### 数据通道¶

* 名称: oai-events
* 用途: 事件传输
* 格式: JSON

### 音频流¶

* 输入: addTrack()
* 输出: ontrack 事件

## 💬 对话交互¶

### 对话模式¶

1. 纯文本对话
2. 语音对话
3. 混合对话

### 会话管理¶

* 创建会话
* 更新会话
* 结束会话
* 会话配置

### 事件类型¶

* 文本事件
* 音频事件
* 函数调用
* 状态更新
* 错误事件

## ⚙️ 配置选项¶

### 音频配置¶

* 输入格式
* pcm16
* g711\_ulaw
* g711\_alaw
* 输出格式
* pcm16
* g711\_ulaw
* g711\_alaw
* 语音类型
* alloy
* echo
* shimmer

### 模型配置¶

* 温度
* 最大输出长度
* 系统提示词
* 工具配置

### VAD 配置¶

* 阈值
* 静音时长
* 前缀填充

## 💡 请求示例¶

### WebRTC 连接 ❌¶

#### 客户端实现 (浏览器)¶

```

async function init() { // 从服务器获取临时密钥 - 参见下方服务器代码 const tokenResponse = await fetch("/session"); const data = await tokenResponse.json(); const EPHEMERAL_KEY = data.client_secret.value; // 创建对等连接 const pc = new RTCPeerConnection(); // 设置播放模型返回的远程音频 const audioEl = document.createElement("audio"); audioEl.autoplay = true; pc.ontrack = e => audioEl.srcObject = e.streams[0]; // 添加浏览器麦克风输入的本地音频轨道 const ms = await navigator.mediaDevices.getUserMedia({ audio: true }); pc.addTrack(ms.getTracks()[0]); // 设置用于发送和接收事件的数据通道 const dc = pc.createDataChannel("oai-events"); dc.addEventListener("message", (e) => { // 这里接收实时服务器事件! console.log(e); }); // 使用会话描述协议(SDP)启动会话 const offer = await pc.createOffer(); await pc.setLocalDescription(offer); const baseUrl = "https://你的 newapi 服务器地址/v1/realtime"; const model = "gpt-4o-realtime-preview-2024-12-17"; const sdpResponse = await fetch(`${baseUrl}?model=${model}`, { method: "POST", body: offer.sdp, headers: { Authorization: `Bearer ${EPHEMERAL_KEY}`, "Content-Type": "application/sdp" }, }); const answer = { type: "answer", sdp: await sdpResponse.text(), }; await pc.setRemoteDescription(answer); } init();

```

#### 服务器端实现 (Node.js)¶

```

import express from "express"; const app = express(); // 创建一个端点用于生成临时令牌 // 该端点与上面的客户端代码配合使用 app.get("/session", async (req, res) => { const r = await fetch("https://你的 newapi 服务器地址/v1/realtime/sessions", { method: "POST", headers: { "Authorization": `Bearer ${process.env.NEW_API_KEY}`, "Content-Type": "application/json", }, body: JSON.stringify({ model: "gpt-4o-realtime-preview-2024-12-17", voice: "verse", }), }); const data = await r.json(); // 将从 OpenAI REST API 收到的 JSON 发送回客户端 res.send(data); }); app.listen(3000);

```

#### WebRTC 事件收发示例¶

```

// 从对等连接创建数据通道 const dc = pc.createDataChannel("oai-events"); // 监听数据通道上的服务器事件 // 事件数据需要从 JSON 字符串解析 dc.addEventListener("message", (e) => { const realtimeEvent = JSON.parse(e.data); console.log(realtimeEvent); }); // 发送客户端事件:将有效的客户端事件序列化为 // JSON,并通过数据通道发送 const responseCreate = { type: "response.create", response: { modalities: ["text"], instructions: "Write a haiku about code", }, }; dc.send(JSON.stringify(responseCreate));

```

### WebSocket 连接 ✅¶

#### Node.js (ws模块)¶

```

import WebSocket from "ws"; const url = "wss://你的 newapi 服务器地址/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17"; const ws = new WebSocket(url, { headers: { "Authorization": "Bearer " + process.env.NEW_API_KEY, "OpenAI-Beta": "realtime=v1", }, }); ws.on("open", function open() { console.log("Connected to server."); }); ws.on("message", function incoming(message) { console.log(JSON.parse(message.toString())); });

```

#### Python (websocket-client)¶

```

# 需要安装 websocket-client 库: # pip install websocket-client import os import json import websocket NEW_API_KEY = os.environ.get("NEW_API_KEY") url = "wss://你的 newapi 服务器地址/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17" headers = [ "Authorization: Bearer " + NEW_API_KEY, "OpenAI-Beta: realtime=v1" ] def on_open(ws): print("Connected to server.") def on_message(ws, message): data = json.loads(message) print("Received event:", json.dumps(data, indent=2)) ws = websocket.WebSocketApp( url, header=headers, on_open=on_open, on_message=on_message, ) ws.run_forever()

```

#### 浏览器 (标准WebSocket)¶

```

/_ 注意:在浏览器等客户端环境中,我们建议使用 WebRTC。 但在 Deno 和 Cloudflare Workers 等类浏览器环境中, 也可以使用标准 WebSocket 接口。 _/ const ws = new WebSocket( "wss://你的 newapi 服务器地址/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17", [ "realtime", // 认证 "openai-insecure-api-key." + NEW_API_KEY, // 可选 "openai-organization." + OPENAI_ORG_ID, "openai-project." + OPENAI_PROJECT_ID, // Beta 协议,必需 "openai-beta.realtime-v1" ] ); ws.on("open", function open() { console.log("Connected to server."); }); ws.on("message", function incoming(message) { console.log(message.data); });

```

#### 消息收发示例¶

##### Node.js/浏览器¶

```

// 接收服务器事件 ws.on("message", function incoming(message) { // 需要从 JSON 解析消息数据 const serverEvent = JSON.parse(message.data) console.log(serverEvent); }); // 发送事件,创建符合客户端事件格式的 JSON 数据结构 const event = { type: "response.create", response: { modalities: ["audio", "text"], instructions: "Give me a haiku about code.", } }; ws.send(JSON.stringify(event));

```

##### Python¶

```

# 发送客户端事件,将字典序列化为 JSON def on_open(ws): print("Connected to server.") event = { "type": "response.create", "response": { "modalities": ["text"], "instructions": "Please assist the user." } } ws.send(json.dumps(event)) # 接收消息需要从 JSON 解析消息负载 def on_message(ws, message): data = json.loads(message) print("Received event:", json.dumps(data, indent=2))

```

## ⚠️ 错误处理¶

### 常见错误¶

1. 连接错误
2. 网络问题
3. 认证失败
4. 配置错误
5. 音频错误
6. 设备权限
7. 格式不支持
8. 编解码问题
9. 会话错误
10. 令牌过期
11. 会话超时
12. 并发限制

### 错误恢复¶

1. 自动重连
2. 会话恢复
3. 错误重试
4. 降级处理

## 📝 事件参考¶

### 通用请求头¶

所有事件都需要包含以下请求头:

| 请求头 | 类型 | 说明 | 示例值 |
| --- | --- | --- | --- |
| Authorization | 字符串 | 认证令牌 | Bearer $NEW\_API\_KEY |
| OpenAI-Beta | 字符串 | API 版本 | realtime=v1 |

### 客户端事件¶

#### session.update¶

更新会话的默认配置。

| 参数 | 类型 | 必需 | 说明 | 示例值/可选值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_123 |
| type | 字符串 | 否 | 事件类型 | session.update |
| modalities | 字符串数组 | 否 | 模型可以响应的模态类型 | ["text", "audio"] |
| instructions | 字符串 | 否 | 预置到模型调用前的系统指令 | "Your knowledge cutoff is 2023-10..." |
| voice | 字符串 | 否 | 模型使用的语音类型 | alloy、echo、shimmer |
| input\_audio\_format | 字符串 | 否 | 输入音频格式 | pcm16、g711\_ulaw、g711\_alaw |
| output\_audio\_format | 字符串 | 否 | 输出音频格式 | pcm16、g711\_ulaw、g711\_alaw |
| input\_audio\_transcription.model | 字符串 | 否 | 用于转写的模型 | whisper-1 |
| turn\_detection.type | 字符串 | 否 | 语音检测类型 | server\_vad |
| turn\_detection.threshold | 数字 | 否 | VAD 激活阈值(0.0-1.0) | 0.8 |
| turn\_detection.prefix\_padding\_ms | 整数 | 否 | 语音开始前包含的音频时长 | 500 |
| turn\_detection.silence\_duration\_ms | 整数 | 否 | 检测语音停止的静音持续时间 | 1000 |
| tools | 数组 | 否 | 模型可用的工具列表 | [] |
| tool\_choice | 字符串 | 否 | 模型选择工具的方式 | auto/none/required |
| temperature | 数字 | 否 | 模型采样温度 | 0.8 |
| max\_output\_tokens | 字符串/整数 | 否 | 单次响应最大token数 | "inf"/4096 |

#### input\_audio\_buffer.append¶

向输入音频缓冲区追加音频数据。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_456 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.append |
| audio | 字符串 | 否 | Base64编码的音频数据 | Base64EncodedAudioData |

#### input\_audio\_buffer.commit¶

将缓冲区中的音频数据提交为用户消息。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_789 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.commit |

#### input\_audio\_buffer.clear¶

清空输入音频缓冲区中的所有音频数据。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_012 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.clear |

#### conversation.item.create¶

向对话中添加新的对话项。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_345 |
| type | 字符串 | 否 | 事件类型 | conversation.item.create |
| previous\_item\_id | 字符串 | 否 | 新对话项将插入在此ID之后 | null |
| item.id | 字符串 | 否 | 对话项的唯一标识符 | msg\_001 |
| item.type | 字符串 | 否 | 对话项类型 | message/function\_call/function\_call\_output |
| item.status | 字符串 | 否 | 对话项状态 | completed/in\_progress/incomplete |
| item.role | 字符串 | 否 | 消息发送者的角色 | user/assistant/system |
| item.content | 数组 | 否 | 消息内容 | [text/audio/transcript] |
| item.call\_id | 字符串 | 否 | 函数调用的ID | call\_001 |
| item.name | 字符串 | 否 | 被调用的函数名称 | function\_name |
| item.arguments | 字符串 | 否 | 函数调用的参数 | {"param": "value"} |
| item.output | 字符串 | 否 | 函数调用的输出结果 | {"result": "value"} |

#### conversation.item.truncate¶

截断助手消息中的音频内容。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_678 |
| type | 字符串 | 否 | 事件类型 | conversation.item.truncate |
| item\_id | 字符串 | 否 | 要截断的助手消息项的ID | msg\_002 |
| content\_index | 整数 | 否 | 要截断的内容部分的索引 | 0 |
| audio\_end\_ms | 整数 | 否 | 音频截断的结束时间点 | 1500 |

#### conversation.item.delete¶

从对话历史中删除指定的对话项。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_901 |
| type | 字符串 | 否 | 事件类型 | conversation.item.delete |
| item\_id | 字符串 | 否 | 要删除的对话项的ID | msg\_003 |

#### response.create¶

触发响应生成。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_234 |
| type | 字符串 | 否 | 事件类型 | response.create |
| response.modalities | 字符串数组 | 否 | 响应的模态类型 | ["text", "audio"] |
| response.instructions | 字符串 | 否 | 给模型的指令 | "Please assist the user." |
| response.voice | 字符串 | 否 | 模型使用的语音类型 | alloy/echo/shimmer |
| response.output\_audio\_format | 字符串 | 否 | 输出音频格式 | pcm16 |
| response.tools | 数组 | 否 | 模型可用的工具列表 | ["type", "name", "description"] |
| response.tool\_choice | 字符串 | 否 | 模型选择工具的方式 | auto |
| response.temperature | 数字 | 否 | 采样温度 | 0.7 |
| response.max\_output\_tokens | 整数/字符串 | 否 | 最大输出token数 | 150/"inf" |

#### response.cancel¶

取消正在进行中的响应生成。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 客户端生成的事件标识符 | event\_567 |
| type | 字符串 | 否 | 事件类型 | response.cancel |

### 服务端事件¶

#### error¶

当发生错误时返回的事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串数组 | 否 | 服务端事件的唯一标识符 | ["event\_890"] |
| type | 字符串 | 否 | 事件类型 | error |
| error.type | 字符串 | 否 | 错误类型 | invalid\_request\_error/server\_error |
| error.code | 字符串 | 否 | 错误代码 | invalid\_event |
| error.message | 字符串 | 否 | 人类可读的错误消息 | "The 'type' field is missing." |
| error.param | 字符串 | 否 | 与错误相关的参数 | null |
| error.event\_id | 字符串 | 否 | 相关事件的ID | event\_567 |

#### conversation.item.input\_audio\_transcription.completed¶

当启用输入音频转写功能并且转写成功时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_2122 |
| type | 字符串 | 否 | 事件类型 | conversation.item.input\_audio\_transcription.completed |
| item\_id | 字符串 | 否 | 用户消息项的ID | msg\_003 |
| content\_index | 整数 | 否 | 包含音频的内容部分的索引 | 0 |
| transcript | 字符串 | 否 | 转写的文本内容 | "Hello, how are you?" |

#### conversation.item.input\_audio\_transcription.failed¶

当配置了输入音频转写功能,但用户消息的转写请求失败时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_2324 |
| type | 字符串数组 | 否 | 事件类型 | ["conversation.item.input\_audio\_transcription.failed"] |
| item\_id | 字符串 | 否 | 用户消息项的ID | msg\_003 |
| content\_index | 整数 | 否 | 包含音频的内容部分的索引 | 0 |
| error.type | 字符串 | 否 | 错误类型 | transcription\_error |
| error.code | 字符串 | 否 | 错误代码 | audio\_unintelligible |
| error.message | 字符串 | 否 | 人类可读的错误消息 | "The audio could not be transcribed." |
| error.param | 字符串 | 否 | 与错误相关的参数 | null |

#### conversation.item.truncated¶

当客户端截断了之前的助手音频消息项时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_2526 |
| type | 字符串 | 否 | 事件类型 | conversation.item.truncated |
| item\_id | 字符串 | 否 | 被截断的助手消息项的ID | msg\_004 |
| content\_index | 整数 | 否 | 被截断的内容部分的索引 | 0 |
| audio\_end\_ms | 整数 | 否 | 音频被截断的时间点(毫秒) | 1500 |

#### conversation.item.deleted¶

当对话中的某个项目被删除时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_2728 |
| type | 字符串 | 否 | 事件类型 | conversation.item.deleted |
| item\_id | 字符串 | 否 | 被删除的对话项的ID | msg\_005 |

#### input\_audio\_buffer.committed¶

当音频缓冲区中的数据被提交时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_1121 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.committed |
| previous\_item\_id | 字符串 | 否 | 新对话项将插入在此ID对应的对话项之后 | msg\_001 |
| item\_id | 字符串 | 否 | 将要创建的用户消息项的ID | msg\_002 |

#### input\_audio\_buffer.cleared¶

当客户端清空输入音频缓冲区时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_1314 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.cleared |

#### input\_audio\_buffer.speech\_started¶

在服务器语音检测模式下,当检测到语音输入时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_1516 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.speech\_started |
| audio\_start\_ms | 整数 | 否 | 从会话开始到检测到语音的毫秒数 | 1000 |
| item\_id | 字符串 | 否 | 语音停止时将创建的用户消息项的ID | msg\_003 |

#### input\_audio\_buffer.speech\_stopped¶

在服务器语音检测模式下,当检测到语音输入停止时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_1718 |
| type | 字符串 | 否 | 事件类型 | input\_audio\_buffer.speech\_stopped |
| audio\_start\_ms | 整数 | 否 | 从会话开始到检测到语音停止的毫秒数 | 2000 |
| item\_id | 字符串 | 否 | 将要创建的用户消息项的ID | msg\_003 |

#### response.created¶

当创建新的响应时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_2930 |
| type | 字符串 | 否 | 事件类型 | response.created |
| response.id | 字符串 | 否 | 响应的唯一标识符 | resp\_001 |
| response.object | 字符串 | 否 | 对象类型 | realtime.response |
| response.status | 字符串 | 否 | 响应的状态 | in\_progress |
| response.status\_details | 对象 | 否 | 状态的附加详细信息 | null |
| response.output | 字符串数组 | 否 | 响应生成的输出项列表 | ["[]"] |
| response.usage | 对象 | 否 | 响应的使用统计信息 | null |

#### response.done¶

当响应完成流式传输时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_3132 |
| type | 字符串 | 否 | 事件类型 | response.done |
| response.id | 字符串 | 否 | 响应的唯一标识符 | resp\_001 |
| response.object | 字符串 | 否 | 对象类型 | realtime.response |
| response.status | 字符串 | 否 | 响应的最终状态 | completed/cancelled/failed/incomplete |
| response.status\_details | 对象 | 否 | 状态的附加详细信息 | null |
| response.output | 字符串数组 | 否 | 响应生成的输出项列表 | ["[...]"] |
| response.usage.total\_tokens | 整数 | 否 | 总token数 | 50 |
| response.usage.input\_tokens | 整数 | 否 | 输入token数 | 20 |
| response.usage.output\_tokens | 整数 | 否 | 输出token数 | 30 |

#### response.output\_item.added¶

当响应生成过程中创建新的输出项时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_3334 |
| type | 字符串 | 否 | 事件类型 | response.output\_item.added |
| response\_id | 字符串 | 否 | 输出项所属的响应ID | resp\_001 |
| output\_index | 字符串 | 否 | 输出项在响应中的索引 | 0 |
| item.id | 字符串 | 否 | 输出项的唯一标识符 | msg\_007 |
| item.object | 字符串 | 否 | 对象类型 | realtime.item |
| item.type | 字符串 | 否 | 输出项类型 | message/function\_call/function\_call\_output |
| item.status | 字符串 | 否 | 输出项状态 | in\_progress/completed |
| item.role | 字符串 | 否 | 与输出项关联的角色 | assistant |
| item.content | 数组 | 否 | 输出项的内容 | ["type", "text", "audio", "transcript"] |

#### response.output\_item.done¶

当输出项完成流式传输时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_3536 |
| type | 字符串 | 否 | 事件类型 | response.output\_item.done |
| response\_id | 字符串 | 否 | 输出项所属的响应ID | resp\_001 |
| output\_index | 字符串 | 否 | 输出项在响应中的索引 | 0 |
| item.id | 字符串 | 否 | 输出项的唯一标识符 | msg\_007 |
| item.object | 字符串 | 否 | 对象类型 | realtime.item |
| item.type | 字符串 | 否 | 输出项类型 | message/function\_call/function\_call\_output |
| item.status | 否 | 输出项的最终状态 | completed/incomplete |
| item.role | 字符串 | 否 | 与输出项关联的角色 | assistant |
| item.content | 数组 | 否 | 输出项的内容 | ["type", "text", "audio", "transcript"] |

#### response.content\_part.added¶

当响应生成过程中向助手消息项添加新的内容部分时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_3738 |
| type | 字符串 | 否 | 事件类型 | response.content\_part.added |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 添加内容部分的消息项ID | msg\_007 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| part.type | 字符串 | 否 | 内容类型 | text/audio |
| part.text | 字符串 | 否 | 文本内容 | "Hello" |
| part.audio | 字符串 | 否 | Base64编码的音频数据 | "base64\_encoded\_audio\_data" |
| part.transcript | 字符串 | 否 | 音频的转写文本 | "Hello" |

#### response.content\_part.done¶

当助手消息项中的内容部分完成流式传输时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_3940 |
| type | 字符串 | 否 | 事件类型 | response.content\_part.done |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 添加内容部分的消息项ID | msg\_007 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| part.type | 字符串 | 否 | 内容类型 | text/audio |
| part.text | 字符串 | 否 | 文本内容 | "Hello" |
| part.audio | 字符串 | 否 | Base64编码的音频数据 | "base64\_encoded\_audio\_data" |
| part.transcript | 字符串 | 否 | 音频的转写文本 | "Hello" |

#### response.text.delta¶

当"text"类型内容部分的文本值更新时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_4142 |
| type | 字符串 | 否 | 事件类型 | response.text.delta |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 消息项的ID | msg\_007 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| delta | 字符串 | 否 | 文本增量更新内容 | "Sure, I can h" |

#### response.text.done¶

当"text"类型内容部分的文本流式传输完成时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_4344 |
| type | 字符串 | 否 | 事件类型 | response.text.done |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 消息项的ID | msg\_007 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| delta | 字符串 | 否 | 最终的完整文本内容 | "Sure, I can help with that." |

#### response.audio\_transcript.delta¶

当模型生成的音频输出转写内容更新时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_4546 |
| type | 字符串 | 否 | 事件类型 | response.audio\_transcript.delta |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 消息项的ID | msg\_008 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| delta | 字符串 | 否 | 转写文本的增量更新内容 | "Hello, how can I a" |

#### response.audio\_transcript.done¶

当模型生成的音频输出转写完成流式传输时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_4748 |
| type | 字符串 | 否 | 事件类型 | response.audio\_transcript.done |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 消息项的ID | msg\_008 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| transcript | 字符串 | 否 | 音频的最终完整转写文本 | "Hello, how can I assist you today?" |

#### response.audio.delta¶

当模型生成的音频内容更新时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_4950 |
| type | 字符串 | 否 | 事件类型 | response.audio.delta |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 消息项的ID | msg\_008 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |
| delta | 字符串 | 否 | Base64编码的音频数据增量 | "Base64EncodedAudioDelta" |

#### response.audio.done¶

当模型生成的音频完成时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_5152 |
| type | 字符串 | 否 | 事件类型 | response.audio.done |
| response\_id | 字符串 | 否 | 响应的ID | resp\_001 |
| item\_id | 字符串 | 否 | 消息项的ID | msg\_008 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| content\_index | 整数 | 否 | 内容部分在消息项内容数组中的索引 | 0 |

### 函数调用¶

#### response.function\_call\_arguments.delta¶

当模型生成的函数调用参数更新时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_5354 |
| type | 字符串 | 否 | 事件类型 | response.function\_call\_arguments.delta |
| response\_id | 字符串 | 否 | 响应的ID | resp\_002 |
| item\_id | 字符串 | 否 | 消息项的ID | fc\_001 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| call\_id | 字符串 | 否 | 函数调用的ID | call\_001 |
| delta | 字符串 | 否 | JSON格式的函数调用参数增量 | "{\"location\": \"San\"" |

#### response.function\_call\_arguments.done¶

当模型生成的函数调用参数完成流式传输时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_5556 |
| type | 字符串 | 否 | 事件类型 | response.function\_call\_arguments.done |
| response\_id | 字符串 | 否 | 响应的ID | resp\_002 |
| item\_id | 字符串 | 否 | 消息项的ID | fc\_001 |
| output\_index | 整数 | 否 | 输出项在响应中的索引 | 0 |
| call\_id | 字符串 | 否 | 函数调用的ID | call\_001 |
| arguments | 字符串 | 否 | 最终的完整函数调用参数(JSON格式) | "{\"location\": \"San Francisco\"}" |

### 其他状态更新¶

#### rate\_limits.updated¶

在每个 "response.done" 事件之后触发,用于指示更新后的速率限制。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_5758 |
| type | 字符串 | 否 | 事件类型 | rate\_limits.updated |
| rate\_limits | 对象数组 | 否 | 速率限制信息列表 | [{"name": "requests\_per\_min", "limit": 60, "remaining": 45, "reset\_seconds": 35}] |

#### conversation.created¶

当对话创建时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_9101 |
| type | 字符串 | 否 | 事件类型 | conversation.created |
| conversation | 对象 | 否 | 对话资源对象 | {"id": "conv\_001", "object": "realtime.conversation"} |

#### conversation.item.created¶

当对话项创建时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_1920 |
| type | 字符串 | 否 | 事件类型 | conversation.item.created |
| previous\_item\_id | 字符串 | 否 | 前一个对话项的ID | msg\_002 |
| item | 对象 | 否 | 对话项对象 | {"id": "msg\_003", "object": "realtime.item", "type": "message", "status": "completed", "role": "user", "content": [{"type": "text", "text": "Hello"}]} |

#### session.created¶

当会话创建时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_1234 |
| type | 字符串 | 否 | 事件类型 | session.created |
| session | 对象 | 否 | 会话对象 | {"id": "sess\_001", "object": "realtime.session", "model": "gpt-4", "modalities": ["text", "audio"]} |

#### session.updated¶

当会话更新时返回此事件。

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 否 | 服务端事件的唯一标识符 | event\_5678 |
| type | 字符串 | 否 | 事件类型 | session.updated |
| session | 对象 | 否 | 更新后的会话对象 | {"id": "sess\_001", "object": "realtime.session", "model": "gpt-4", "modalities": ["text", "audio"]} |

### 速率限制事件参数表¶

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name | 字符串 | 是 | 限制名称 | requests\_per\_min |
| limit | 整数 | 是 | 限制值 | 60 |
| remaining | 整数 | 是 | 剩余可用量 | 45 |
| reset\_seconds | 整数 | 是 | 重置时间(秒) | 35 |

### 函数调用参数表¶

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| type | 字符串 | 是 | 函数类型 | function |
| name | 字符串 | 是 | 函数名称 | get\_weather |
| description | 字符串 | 否 | 函数描述 | Get the current weather |
| parameters | 对象 | 是 | 函数参数定义 | {"type": "object", "properties": {...}} |

### 音频格式参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- |
| sample\_rate | 整数 | 采样率 | 8000, 16000, 24000, 44100, 48000 |
| channels | 整数 | 声道数 | 1 (单声道), 2 (立体声) |
| bits\_per\_sample | 整数 | 采样位数 | 16 (pcm16), 8 (g711) |
| encoding | 字符串 | 编码方式 | pcm16, g711\_ulaw, g711\_alaw |

### 语音检测参数表¶

| 参数 | 类型 | 说明 | 默认值 | 范围 |
| --- | --- | --- | --- | --- |
| threshold | 浮点数 | VAD 激活阈值 | 0.5 | 0.0-1.0 |
| prefix\_padding\_ms | 整数 | 语音前缀填充(毫秒) | 500 | 0-5000 |
| silence\_duration\_ms | 整数 | 静音检测时长(毫秒) | 1000 | 100-10000 |

### 工具选择参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- |
| tool\_choice | 字符串 | 工具选择方式 | auto, none, required |
| tools | 数组 | 可用工具列表 | [{type, name, description, parameters}] |

### 模型配置参数表¶

| 参数 | 类型 | 说明 | 范围/可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| temperature | 浮点数 | 采样温度 | 0.0-2.0 | 1.0 |
| max\_output\_tokens | 整数/字符串 | 最大输出长度 | 1-4096/"inf" | "inf" |
| modalities | 字符串数组 | 响应模态 | ["text", "audio"] | ["text"] |
| voice | 字符串 | 语音类型 | alloy, echo, shimmer | alloy |

### 事件通用参数表¶

| 参数 | 类型 | 必需 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| event\_id | 字符串 | 是 | 事件的唯一标识符 | event\_123 |
| type | 字符串 | 是 | 事件类型 | session.update |
| timestamp | 整数 | 否 | 事件发生的时间戳(毫秒) | 1677649363000 |

### 会话状态参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| status | 字符串 | 会话状态 | active, ended, error |
| error | 对象 | 错误信息 | {"type": "error\_type", "message": "error message"} |
| metadata | 对象 | 会话元数据 | {"client\_id": "web", "session\_type": "chat"} |

### 对话项状态参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| status | 字符串 | 对话项状态 | completed, in\_progress, incomplete |
| role | 字符串 | 发送者角色 | user, assistant, system |
| type | 字符串 | 对话项类型 | message, function\_call, function\_call\_output |

### 内容类型参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| type | 字符串 | 内容类型 | text, audio, transcript |
| format | 字符串 | 内容格式 | plain, markdown, html |
| encoding | 字符串 | 编码方式 | utf-8, base64 |

### 响应状态参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- | --- |
| status | 字符串 | 响应状态 | completed, cancelled, failed, incomplete |
| status\_details | 对象 | 状态详情 | {"reason": "user\_cancelled"} |
| usage | 对象 | 使用统计 | {"total\_tokens": 50, "input\_tokens": 20, "output\_tokens": 30} |

### 音频转写参数表¶

| 参数 | 类型 | 说明 | 示例值 |
| --- | --- | --- | --- |
| enabled | 布尔值 | 是否启用转写 | true |
| model | 字符串 | 转写模型 | whisper-1 |
| language | 字符串 | 转写语言 | en, zh, auto |
| prompt | 字符串 | 转写提示词 | "Transcript of a conversation" |

### 音频流参数表¶

| 参数 | 类型 | 说明 | 可选值 |
| --- | --- | --- | --- |
| chunk\_size | 整数 | 音频块大小(字节) | 1024, 2048, 4096 |
| latency | 字符串 | 延迟模式 | low, balanced, high |
| compression | 字符串 | 压缩方式 | none, opus, mp3 |

### WebRTC 配置参数表¶

| 参数 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| ice\_servers | 数组 | ICE 服务器列表 | [{"urls": "stun:stun.l.google.com:19302"}] |
| audio\_constraints | 对象 | 音频约束 | {"echoCancellation": true} |
| connection\_timeout | 整数 | 连接超时(毫秒) | 30000 |

## New API

🍥新一代大模型网关与AI资产管理系统

### 关于我们

* 关于项目
* 联系我们
* 功能特性

### 文档

* 快速开始
* 安装指南
* API 文档

### 相关项目

* One API
* Midjourney-Proxy
* chatnio
* neko-api-key-tool

### 基于New API的项目

* new-api-horizon
* VoAPI

Copyright © 2025 Quantum Nous. All Rights Reserved.

渝ICP备2025052930号

Made with ❤ by Quantum Nous

### 图像 (Image)

OpenAI 格式(Image) - New API Docs

跳转至

在 GitHub 上关注我们的最新动态或加入我们的 QQ 交流群

# OpenAI 图像格式(Image)¶

官方文档

OpenAI Images

## 📝 简介¶

给定文本提示和/或输入图片,模型将生成新的图片。OpenAI 提供多种强大的图像生成模型,可以根据自然语言描述创建、编辑和修改图像。目前支持的模型包括:

| 模型 | 描述 |
| --- | --- |
| DALL·E 系列 | 包括 DALL·E 2 和 DALL·E 3 两个版本,它们在图像质量、创意表现和精确度上都有显著差异 |
| GPT-Image-1 | OpenAI最新图片模型,支持多图片编辑功能,能够基于多个输入图像创建新的组合图像 |

## 💡 请求示例¶

### 创建图片 ✅¶

```

# 基础图片生成 curl https://你的 newapi 服务器地址/v1/images/generations \ -H "Content-Type: application/json" \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -d '{ "model": "dall-e-3", "prompt": "一只可爱的小海獭", "n": 1, "size": "1024x1024" }' # 高质量图片生成 curl https://你的 newapi 服务器地址/v1/images/generations \ -H "Content-Type: application/json" \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -d '{ "model": "dall-e-3", "prompt": "一只可爱的小海獭", "quality": "hd", "style": "vivid", "size": "1024x1024" }' # 使用 base64 返回格式 curl https://你的 newapi 服务器地址/v1/images/generations \ -H "Content-Type: application/json" \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -d '{ "model": "dall-e-3", "prompt": "一只可爱的小海獭", "response_format": "b64_json" }'

```

响应示例:

```

{ "created": 1589478378, "data": [ { "url": "https://...", "revised_prompt": "一只可爱的小海獭在水中嬉戏,它有着圆圆的眼睛和毛茸茸的皮毛" } ] }

```

### 编辑图片 ✅¶

```

# dall-e-2 图片编辑 curl https://你的 newapi 服务器地址/v1/images/edits \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -F image="@otter.png" \ -F mask="@mask.png" \ -F prompt="一只戴着贝雷帽的可爱小海獭" \ -F n=2 \ -F size="1024x1024" # gpt-image-1 多图片编辑示例 curl https://你的 newapi 服务器地址/v1/images/edits \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -F "model=gpt-image-1" \ -F "image[]=@body-lotion.png" \ -F "image[]=@bath-bomb.png" \ -F "image[]=@incense-kit.png" \ -F "image[]=@soap.png" \ -F "prompt=创建一个包含这四个物品的精美礼品篮" \ -F "quality=high"

```

响应示例 (dall-e-2):

```

{ "created": 1589478378, "data": [ { "url": "https://..." }, { "url": "https://..." } ] }

```

响应示例 (gpt-image-1):

```

{ "created": 1713833628, "data": [ { "b64_json": "..." } ], "usage": { "total_tokens": 100, "input_tokens": 50, "output_tokens": 50, "input_tokens_details": { "text_tokens": 10, "image_tokens": 40 } } }

```

### 生成图片变体 ✅¶

```

curl https://你的 newapi 服务器地址/v1/images/variations \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -F image="@otter.png" \ -F n=2 \ -F size="1024x1024"

```

响应示例:

```

{ "created": 1589478378, "data": [ { "url": "https://..." }, { "url": "https://..." } ] }

```

## 📮 请求¶

### 端点¶

#### 创建图片¶

```

POST /v1/images/generations

```

根据文本提示创建图片。

#### 编辑图片¶

```

POST /v1/images/edits

```

根据一个或多个原始图片和提示创建编辑或扩展的图片。此端点支持 dall-e-2 和 gpt-image-1 模型。

#### 生成变体¶

```

POST /v1/images/variations

```

创建给定图片的变体。

### 鉴权方法¶

在请求头中包含以下内容进行 API 密钥认证:

```

Authorization: Bearer $NEWAPI_API_KEY

```

其中 $OPENAI\_API\_KEY 是您的 API 密钥。

### 请求体参数¶

#### 创建图片¶

##### prompt¶

* 类型:字符串
* 必需:是
* 说明:期望生成图片的文本描述。
* dall-e-2 最大长度为 1000 字符
* dall-e-3 最大长度为 4000 字符
* 提示:
* 使用具体和详细的描述
* 包含关键的视觉元素
* 指定期望的艺术风格
* 描述构图和视角

##### model¶

* 类型:字符串
* 必需:否
* 默认值:dall-e-2
* 说明:用于图像生成的模型。

##### n¶

* 类型:整数或 null
* 必需:否
* 默认值:1
* 说明:要生成的图片数量。必须在 1-10 之间。dall-e-3 仅支持 n=1。

##### quality¶

* 类型:字符串
* 必需:否
* 默认值:standard
* 说明:生成图片的质量。hd 选项会生成更细致和一致的图片。仅 dall-e-3 支持此参数。

##### response\_format¶

* 类型:字符串或 null
* 必需:否
* 默认值:url
* 说明:返回生成图片的格式。必须是 url 或 b64\_json 之一。URL 在生成后 60 分钟内有效。

##### size¶

* 类型:字符串或 null
* 必需:否
* 默认值:1024x1024
* 说明:生成图片的尺寸。dall-e-2 必须是 256x256、512x512 或 1024x1024 之一。dall-e-3 必须是 1024x1024、1792x1024 或 1024x1792 之一。

##### style¶

* 类型:字符串或 null
* 必需:否
* 默认值:vivid
* 说明:生成图片的风格。必须是 vivid 或 natural 之一。vivid 倾向于生成超现实和戏剧性的图片,natural 倾向于生成更自然、不那么超现实的图片。仅 dall-e-3 支持此参数。

##### user¶

* 类型:字符串
* 必需:否
* 说明:代表最终用户的唯一标识符,可帮助 OpenAI 监控和检测滥用行为。

#### 编辑图片¶

##### image¶

* 类型:文件或文件数组
* 必需:是
* 说明:要编辑的图片。
* 对于 dall-e-2:必须是有效的 PNG 文件,小于 4MB,且为正方形。如果未提供 mask,图片必须具有透明度,这将用作蒙版。
* 对于 gpt-image-1:可以提供多个图片作为数组,每个图片应为 PNG、WEBP 或 JPG 文件,小于 25MB。

##### prompt¶

* 类型:字符串
* 必需:是
* 说明:期望生成图片的文本描述。
* dall-e-2 最大长度为 1000 字符
* gpt-image-1 最大长度为 32000 字符

##### mask¶

* 类型:文件
* 必需:否
* 说明:额外的图片,其完全透明区域(如 alpha 为零的区域)指示应该编辑的位置。如果提供了多个图片,mask 将应用于第一张图片。必须是有效的 PNG 文件,小于 4MB,且与 image 具有相同尺寸。

##### model¶

* 类型:字符串
* 必需:否
* 默认值:dall-e-2
* 说明:用于图像生成的模型。支持 dall-e-2 和 gpt-image-1。除非使用了 gpt-image-1 特有的参数,否则默认为 dall-e-2。

##### quality¶

* 类型:字符串或 null
* 必需:否
* 默认值:auto
* 说明:生成图片的质量。
* gpt-image-1 支持 high、medium 和 low
* dall-e-2 仅支持 standard
* 默认为 auto

##### size¶

* 类型:字符串或 null
* 必需:否
* 默认值:1024x1024
* 说明:生成图片的尺寸。
* gpt-image-1 必须是 1024x1024、1536x1024(横版)、1024x1536(竖版)或 auto(默认)之一
* dall-e-2 必须是 256x256、512x512 或 1024x1024 之一

其他参数与创建图片接口相同。

#### 生成变体¶

##### image¶

* 类型:文件
* 必需:是
* 说明:作为变体基础的图片。必须是有效的 PNG 文件,小于 4MB,且为正方形。

其他参数与创建图片接口相同。

## 📥 响应¶

### 成功响应¶

所有三个端点都返回包含图片对象列表的响应。

#### created¶

* 类型:整数
* 说明:响应创建的时间戳

#### data¶

* 类型:数组
* 说明:生成的图片对象列表

#### usage(仅适用于 gpt-image-1)¶

* 类型:对象
* 说明:API 调用的令牌使用情况
* total\_tokens:使用的总令牌数
* input\_tokens:输入使用的令牌数
* output\_tokens:输出使用的令牌数
* input\_tokens\_details:输入令牌的详细信息(文本令牌和图像令牌)

### 图片对象¶

#### b64\_json¶

* 类型:字符串
* 说明:如果 response\_format 为 b64\_json,则包含生成图片的 base64 编码 JSON

#### url¶

* 类型:字符串
* 说明:如果 response\_format 为 url(默认),则包含生成图片的 URL

#### revised\_prompt¶

* 类型:字符串
* 说明:如果提示有任何修改,则包含用于生成图片的修改后的提示

示例图片对象:

```

{ "url": "https://...", "revised_prompt": "一只可爱的小海獭在水中嬉戏,它有着圆圆的眼睛和毛茸茸的皮毛" }

```

## 🌟 最佳实践¶

### Prompt 编写建议¶

1. 使用清晰具体的描述
2. 指定重要的视觉细节
3. 描述期望的艺术风格和氛围
4. 注意构图和视角的说明

### 参数选择建议¶

1. 模型选择
2. dall-e-3:适合需要高质量、精确细节的场景
3. dall-e-2:适合快速原型或简单图像生成
4. 尺寸选择
5. 1024x1024:通用场景的最佳选择
6. 1792x1024/1024x1536:适合横版/竖版场景
7. 较小尺寸:适合缩略图或快速预览
8. 质量和风格
9. quality=hd:用于需要精细细节的图像
10. style=vivid:适合创意和艺术效果
11. style=natural:适合真实场景再现

### 常见问题¶

1. 图片生成失败
2. 检查 prompt 是否符合内容政策
3. 确认文件格式和大小限制
4. 验证 API 密钥权限
5. 结果与预期不符
6. 优化 prompt 描述
7. 调整质量和风格参数
8. 考虑使用图片编辑或变体功能

## New API

🍥新一代大模型网关与AI资产管理系统

### 关于我们

* 关于项目
* 联系我们
* 功能特性

### 文档

* 快速开始
* 安装指南
* API 文档

### 相关项目

* One API
* Midjourney-Proxy
* chatnio
* neko-api-key-tool

### 基于New API的项目

* new-api-horizon
* VoAPI

Copyright © 2025 Quantum Nous. All Rights Reserved.

渝ICP备2025052930号

Made with ❤ by Quantum Nous

### 音频 (Audio)

OpenAI 格式 - New API Docs

跳转至

在 GitHub 上关注我们的最新动态或加入我们的 QQ 交流群

# OpenAI 音频格式¶

官方文档

OpenAI Audio

## 📝 简介¶

OpenAI 音频 API 提供了三个主要功能:

1. 文本转语音(TTS) - 将文本转换为自然的语音
2. 语音转文本(STT) - 将音频转录为文本
3. 音频翻译 - 将非英语音频翻译成英语文本

## 💡 请求示例¶

### 文本转语音 ✅¶

```

curl https://你的 newapi 服务器地址/v1/audio/speech \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -H "Content-Type: application/json" \ -d '{ "model": "tts-1", "input": "你好,世界!", "voice": "alloy" }' \ --output speech.mp3

```

### 语音转文本 ✅¶

```

curl https://你的 newapi 服务器地址/v1/audio/transcriptions \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -H "Content-Type: multipart/form-data" \ -F file="@/path/to/file/audio.mp3" \ -F model="whisper-1"

```

响应示例:

```

{ "text": "你好,世界!" }

```

### 音频翻译 ✅¶

```

curl https://你的 newapi 服务器地址/v1/audio/translations \ -H "Authorization: Bearer $NEWAPI_API_KEY" \ -H "Content-Type: multipart/form-data" \ -F file="@/path/to/file/chinese.mp3" \ -F model="whisper-1"

```

响应示例:

```

{ "text": "Hello, world!" }

```

## 📮 请求¶

### 端点¶

#### 文本转语音¶

```

POST /v1/audio/speech

```

将文本转换为语音。

#### 语音转文本¶

```

POST /v1/audio/transcriptions

```

将音频转录为输入语言的文本。

#### 音频翻译¶

```

POST /v1/audio/translations

```

将音频翻译为英语文本。

### 鉴权方法¶

在请求头中包含以下内容进行 API 密钥认证:

```

Authorization: Bearer $NEWAPI_API_KEY

```

其中 $NEWAPI\_API\_KEY 是您的 API 密钥。

### 请求体参数¶

#### 文本转语音¶

##### model¶

* 类型:字符串
* 必需:是
* 可选值:tts-1, tts-1-hd
* 说明:要使用的 TTS 模型

##### input¶

* 类型:字符串
* 必需:是
* 最大长度:4096 字符
* 说明:要转换为语音的文本

##### voice¶

* 类型:字符串
* 必需:是
* 可选值:alloy, echo, fable, onyx, nova, shimmer
* 说明:生成语音时使用的声音

##### response\_format¶

* 类型:字符串
* 必需:否
* 默认值:mp3
* 可选值:mp3, opus, aac, flac, wav, pcm
* 说明:音频输出格式

##### speed¶

* 类型:数字
* 必需:否
* 默认值:1.0
* 范围:0.25 - 4.0
* 说明:生成语音的速度

#### 语音转文本¶

##### file¶

* 类型:文件
* 必需:是
* 支持格式:flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
* 说明:要转录的音频文件

##### model¶

* 类型:字符串
* 必需:是
* 当前仅支持:whisper-1
* 说明:要使用的模型 ID

##### language¶

* 类型:字符串
* 必需:否
* 格式:ISO-639-1 (如 "en")
* 说明:音频的语言,提供可提高准确性

##### prompt¶

* 类型:字符串
* 必需:否
* 说明:用于指导模型风格或继续前一段音频的文本

##### response\_format¶

* 类型:字符串
* 必需:否
* 默认值:json
* 可选值:json, text, srt, verbose\_json, vtt
* 说明:输出格式

##### temperature¶

* 类型:数字
* 必需:否
* 默认值:0
* 范围:0 - 1
* 说明:采样温度,较高的值使输出更随机

##### timestamp\_granularities¶

* 类型:数组
* 必需:否
* 默认值:segment
* 可选值:word, segment
* 说明:转录的时间戳粒度

#### 音频翻译¶

##### file¶

* 类型:文件
* 必需:是
* 支持格式:flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, webm
* 说明:要翻译的音频文件

##### model¶

* 类型:字符串
* 必需:是
* 当前仅支持:whisper-1
* 说明:要使用的模型 ID

##### prompt¶

* 类型:字符串
* 必需:否
* 说明:用于指导模型风格的英文文本

##### response\_format¶

* 类型:字符串
* 必需:否
* 默认值:json
* 可选值:json, text, srt, verbose\_json, vtt
* 说明:输出格式

##### temperature¶

* 类型:数字
* 必需:否
* 默认值:0
* 范围:0 - 1
* 说明:采样温度,较高的值使输出更随机

## 📥 响应¶

### 成功响应¶

#### 文本转语音¶

返回二进制音频文件内容。

#### 语音转文本¶

##### 基础 JSON 格式¶

```

{ "text": "转录的文本内容" }

```

##### 详细 JSON 格式¶

```

{ "task": "transcribe", "language": "english", "duration": 8.47, "text": "完整的转录文本", "segments": [ { "id": 0, "seek": 0, "start": 0.0, "end": 3.32, "text": "分段的转录文本", "tokens": [50364, 440, 7534], "temperature": 0.0, "avg_logprob": -0.286, "compression_ratio": 1.236, "no_speech_prob": 0.009 } ] }

```

#### 音频翻译¶

```

{ "text": "翻译后的英文文本" }

```

### 错误响应¶

当请求出现问题时,API 将返回一个错误响应对象,HTTP 状态码在 4XX-5XX 范围内。

#### 常见错误状态码¶

* 400 Bad Request: 请求参数无效
* 401 Unauthorized: API 密钥无效或未提供
* 429 Too Many Requests: 超出 API 调用限制
* 500 Internal Server Error: 服务器内部错误

错误响应示例:

```

{ "error": { "message": "文件格式不支持", "type": "invalid_request_error", "param": "file", "code": "invalid_file_format" } }

```

## New API

🍥新一代大模型网关与AI资产管理系统

### 关于我们

* 关于项目
* 联系我们
* 功能特性

### 文档

* 快速开始
* 安装指南
* API 文档

### 相关项目

* One API
* Midjourney-Proxy
* chatnio
* neko-api-key-tool

### 基于New API的项目

* new-api-horizon
* VoAPI

Copyright © 2025 Quantum Nous. All Rights Reserved.

渝ICP备2025052930号

Made with ❤ by Quantum Nous

### 音乐 (Music)

## 功能支持标识说明

* ✅ 已支持: 该功能已经完全实现并可以使用
* ❌ 未支持: 该功能正在开发中或计划开发
```
