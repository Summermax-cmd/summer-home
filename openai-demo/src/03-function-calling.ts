import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 模拟的天气查询函数
 */
function getWeather(location: string): string {
  const weatherData: Record<string, string> = {
    '北京': '晴天，温度 15°C',
    '上海': '多云，温度 20°C',
    '广州': '阴天，温度 25°C',
  };
  return weatherData[location] || `无法获取 ${location} 的天气信息`;
}

/**
 * 示例 3：函数调用（Function Calling）
 * 演示如何让 AI 调用自定义函数来获取外部数据
 */
async function functionCallingExample() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('🤖 函数调用示例\n');

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: '北京今天天气怎么样？',
      },
    ];

    // 定义可用的函数
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: '获取指定城市的天气信息',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: '城市名称，例如：北京、上海',
              },
            },
            required: ['location'],
          },
        },
      },
    ];

    console.log('📤 第一次请求：用户提问');
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
    });

    const assistantMessage = response.choices[0]?.message;
    console.log('📥 AI 响应：', assistantMessage);

    // 检查 AI 是否要调用函数
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      messages.push(assistantMessage);

      // 执行函数调用
      for (const toolCall of assistantMessage.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function.name === 'get_weather') {
          const args = JSON.parse(toolCall.function.arguments);
          console.log(`\n🔧 调用函数：get_weather(${args.location})`);
          
          const weatherResult = getWeather(args.location);
          console.log(`📊 函数返回：${weatherResult}`);

          // 将函数结果添加到消息历史
          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: weatherResult,
          });
        }
      }

      // 第二次请求：让 AI 基于函数结果生成最终回复
      console.log('\n📤 第二次请求：带上函数结果');
      const finalResponse = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
      });

      console.log('\n✅ 最终回复：');
      console.log(finalResponse.choices[0]?.message.content);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ 错误：', error.message);
    }
  }
}

// 运行示例
functionCallingExample();

