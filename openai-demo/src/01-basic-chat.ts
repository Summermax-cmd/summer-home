import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 示例 1：基础聊天补全
 * 演示如何使用 OpenAI API 进行简单的聊天对话
 */
async function basicChat() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('🤖 发送请求到 OpenAI...\n');

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini', // 或使用 'gpt-4', 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: '你是一个友好的 AI 助手。',
        },
        {
          role: 'user',
          content: '用一句话讲一个关于独角兽的睡前故事。',
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    console.log('✅ 响应内容：');
    console.log(response.choices[0]?.message.content);
    console.log('\n📊 使用的 tokens：', response.usage);
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ 错误：', error.message);
    }
  }
}

// 运行示例
basicChat();

