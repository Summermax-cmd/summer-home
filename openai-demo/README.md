# OpenAI API 示例项目

这是一个使用 OpenAI API 的 TypeScript 示例项目，包含多个实用示例。

## 📦 安装

```bash
npm install
```

## 🔑 配置 API Key

1. 复制 `.env.example` 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 在 `.env` 文件中填入你的 OpenAI API Key：
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

   > 💡 在 [OpenAI Platform](https://platform.openai.com/api-keys) 获取 API Key

## 🚀 运行示例

### 示例 1：基础聊天补全
演示最基本的 OpenAI API 调用方式。

```bash
npx ts-node src/01-basic-chat.ts
```

**功能：**
- 发送单轮对话请求
- 获取 AI 生成的完整响应
- 查看 token 使用情况

---

### 示例 2：流式输出
演示如何实现类似 ChatGPT 的打字机效果。

```bash
npx ts-node src/02-streaming.ts
```

**功能：**
- 启用流式输出 (`stream: true`)
- 实时逐块接收 AI 响应
- 更好的用户体验

---

### 示例 3：函数调用（Function Calling）
演示如何让 AI 调用自定义函数获取外部数据。

```bash
npx ts-node src/03-function-calling.ts
```

**功能：**
- 定义可调用的函数（工具）
- AI 自动判断是否需要调用函数
- 基于函数返回结果生成最终回复

---

### 示例 4：图像识别（Vision）
演示如何使用 GPT-4 Vision 分析图片内容。

```bash
npm run demo4
```

**功能：**
- 分析在线图片 URL
- 支持本地图片（base64 编码）
- 多模态对话（文本 + 图片）

---

## 📚 示例说明

### 模型选择

- `gpt-4o-mini`：性价比高，推荐用于开发测试
- `gpt-4`：最强大，适合复杂任务
- `gpt-3.5-turbo`：速度快，成本低

### 常用参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `model` | 使用的模型 | - |
| `messages` | 对话历史 | - |
| `max_tokens` | 最大生成 token 数 | 无限制 |
| `temperature` | 创造性（0-2） | 1 |
| `stream` | 是否启用流式输出 | false |

### 消息角色（Role）

- `system`：设定 AI 的行为和身份
- `user`：用户的输入
- `assistant`：AI 的响应
- `tool`：函数调用的结果

## 🔧 开发

构建项目：
```bash
npm run build
```

TypeScript 配置在 `tsconfig.json` 中。

## 📖 参考文档

- [OpenAI API 官方文档](https://platform.openai.com/docs)
- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [Function Calling 指南](https://platform.openai.com/docs/guides/function-calling)

## ⚠️ 注意事项

1. **保护 API Key**：不要将 `.env` 文件提交到 Git
2. **成本控制**：注意 API 调用费用，建议设置使用限额
3. **速率限制**：注意 API 调用频率限制

## 📝 许可

ISC

