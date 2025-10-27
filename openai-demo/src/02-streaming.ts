import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 示例 2：流式输出
 * 演示如何使用流式输出，实时获取 AI 生成的内容（类似 ChatGPT 打字效果）
 */
async function streamingChat() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('🤖 开始流式输出...\n');
  console.log('AI: ');

  try {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: '请用三句话介绍一下人工智能的发展历程。',
        },
      ],
      stream: true, // 启用流式输出
      max_tokens: 200,
    });

    // 逐块处理流式响应
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content); // 实时打印，不换行
    }

    console.log('\n\n✅ 流式输出完成');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ 错误：', error.message);
    }
  }
}

// 运行示例
streamingChat();

