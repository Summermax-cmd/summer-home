import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * 示例 4：图像识别（Vision）
 * 演示如何使用 GPT-4 Vision 分析图片内容
 */
async function visionExample() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('🤖 图像识别示例\n');

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',  // ✅ 支持视觉的模型（gpt-4o 或 gpt-4-turbo）
      messages: [       // ✅ 使用 messages 而非 input
        {
          role: 'user',
          content: [    // ✅ content 是数组，包含文本和图片
            {
              type: 'text',  // ✅ 正确的类型名称
              text: 'What is in this image? Please describe it in detail.',
            },
            {
              type: 'image_url',  // ✅ 正确的类型名称
              image_url: {
                url: 'https://openai-documentation.vercel.app/images/cat_and_otter.png',
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    console.log('✅ AI 分析结果：');
    console.log(response.choices[0]?.message.content);  // ✅ 正确的响应解析
    console.log('\n📊 使用的 tokens：', response.usage);
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ 错误：', error.message);
    }
  }
}

/**
 * 示例：分析本地图片（使用 base64 编码）
 */
async function analyzeLocalImage() {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log('\n🖼️  本地图片分析示例\n');

  try {
    // 示例：如果你有本地图片，可以转换为 base64
    // const fs = require('fs');
    // const imageBuffer = fs.readFileSync('path/to/your/image.jpg');
    // const base64Image = imageBuffer.toString('base64');

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '这张图片里有什么？请用中文详细描述。',
            },
            {
              type: 'image_url',
              image_url: {
                // 可以使用 data URL 格式
                url: 'data:image/jpeg;base64,YOUR_BASE64_STRING_HERE',
                // 或者直接使用在线图片 URL
                // url: 'https://example.com/your-image.jpg',
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    console.log('✅ AI 分析结果：');
    console.log(response.choices[0]?.message.content);
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ 错误：', error.message);
      console.log('💡 提示：如果使用本地图片，需要将图片转换为 base64 格式');
    }
  }
}

// 运行示例
console.log('='.repeat(60));
console.log('OpenAI Vision API 示例');
console.log('='.repeat(60));

visionExample();

// 如果需要测试本地图片，取消下面的注释
// analyzeLocalImage();

