/**
 * Contact Section 表单提交逻辑详细说明
 * 
 * 本文件详细说明了 Contact Section 中表单提交的完整实现逻辑
 */

// ============================================================================
// 1. HTML 表单结构
// ============================================================================

/*
表单包含以下字段：
- Name (姓名): 文本输入框，必填
- Email (邮箱): 邮箱输入框，必填，有格式验证
- Message (消息): 多行文本输入框，必填
- Submit Button (提交按钮): 带有加载状态的按钮

HTML 结构：
<form id="contact-form" class="space-y-6">
    <div>
        <label for="name">姓名</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div>
        <label for="email">邮箱</label>
        <input type="email" id="email" name="email" required>
    </div>
    <div>
        <label for="message">消息</label>
        <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    <button type="submit">
        <span id="submit-text">发送消息</span>
        <span id="submit-loading" class="hidden">发送中...</span>
    </button>
</form>

消息显示区域：
<div id="form-message" class="hidden">
    <div id="success-message">感谢您的留言！</div>
    <div id="error-message">发送失败，请稍后重试。</div>
</div>
*/

// ============================================================================
// 2. JavaScript 实现逻辑
// ============================================================================

/**
 * 表单提交事件监听器
 * 当用户点击提交按钮时触发
 */
function initializeFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            // 阻止默认的表单提交行为
            e.preventDefault();
            
            // 步骤 1: 收集表单数据
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            // 步骤 2: 显示加载状态
            showLoadingState();
            
            try {
                // 步骤 3: 发送 POST 请求到 /api/contact
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                // 步骤 4: 处理响应
                const result = await response.json();
                
                if (response.ok && result.success) {
                    // 成功情况：状态码 200 或 201
                    showSuccessMessage();
                    contactForm.reset(); // 清空表单
                } else {
                    // 失败情况：显示错误消息
                    showErrorMessage(result.message || '发送失败，请稍后重试');
                }
            } catch (error) {
                // 网络错误或其他异常
                console.error('表单提交错误:', error);
                showErrorMessage('网络错误，请检查连接后重试');
            } finally {
                // 步骤 5: 隐藏加载状态
                hideLoadingState();
            }
        });
    }
}

// ============================================================================
// 3. 状态管理函数
// ============================================================================

/**
 * 显示加载状态
 * - 隐藏"发送消息"文本
 * - 显示"发送中..."和旋转图标
 * - 隐藏之前的消息
 */
function showLoadingState() {
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    const formMessage = document.getElementById('form-message');
    
    submitText.classList.add('hidden');
    submitLoading.classList.remove('hidden');
    formMessage.classList.add('hidden');
}

/**
 * 隐藏加载状态
 * - 显示"发送消息"文本
 * - 隐藏"发送中..."和旋转图标
 */
function hideLoadingState() {
    const submitText = document.getElementById('submit-text');
    const submitLoading = document.getElementById('submit-loading');
    
    submitText.classList.remove('hidden');
    submitLoading.classList.add('hidden');
}

/**
 * 显示成功消息
 * - 显示绿色成功消息："感谢您的留言！"
 * - 隐藏错误消息
 * - 3秒后自动隐藏
 */
function showSuccessMessage() {
    const formMessage = document.getElementById('form-message');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    formMessage.classList.remove('hidden');
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    // 3秒后自动隐藏成功消息
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 3000);
}

/**
 * 显示错误消息
 * - 显示红色错误消息
 * - 隐藏成功消息
 * - 5秒后自动隐藏
 * - 支持自定义错误消息内容
 */
function showErrorMessage(message) {
    const formMessage = document.getElementById('form-message');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    formMessage.classList.remove('hidden');
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
    
    // 更新错误消息内容
    const errorText = errorMessage.querySelector('div');
    if (errorText) {
        errorText.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            ${message}
        `;
    }
    
    // 5秒后自动隐藏错误消息
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

// ============================================================================
// 4. 完整的执行流程
// ============================================================================

/*
用户操作流程：

1. 用户填写表单
   ├── 输入姓名
   ├── 输入邮箱（自动验证格式）
   └── 输入消息内容

2. 用户点击"发送消息"按钮
   ├── 触发 submit 事件
   ├── 阻止默认提交行为
   └── 开始异步处理

3. 数据收集和验证
   ├── 使用 FormData 收集表单数据
   ├── 转换为 JSON 格式
   └── 准备发送到 API

4. 显示加载状态
   ├── 按钮文本变为"发送中..."
   ├── 显示旋转加载图标
   └── 禁用按钮防止重复提交

5. 发送 API 请求
   ├── POST 请求到 /api/contact
   ├── Content-Type: application/json
   └── 包含 name, email, message 数据

6. 处理响应
   ├── 成功 (200/201): 显示成功消息，清空表单
   ├── 失败 (4xx/5xx): 显示错误消息
   └── 网络错误: 显示网络错误消息

7. 隐藏加载状态
   ├── 恢复按钮原始状态
   └── 允许用户重新提交

8. 自动隐藏消息
   ├── 成功消息: 3秒后自动隐藏
   └── 错误消息: 5秒后自动隐藏
*/

// ============================================================================
// 5. 错误处理策略
// ============================================================================

/*
错误类型和处理方式：

1. 网络错误
   - 原因: 服务器未启动、网络断开等
   - 处理: 显示"网络错误，请检查连接后重试"

2. 服务器错误 (5xx)
   - 原因: 服务器内部错误
   - 处理: 显示服务器返回的错误消息

3. 客户端错误 (4xx)
   - 原因: 数据验证失败、格式错误等
   - 处理: 显示具体的错误信息

4. 数据验证错误
   - 原因: 必填字段为空、邮箱格式错误等
   - 处理: 显示相应的验证错误信息
*/

// ============================================================================
// 6. 用户体验优化
// ============================================================================

/*
用户体验特性：

1. 视觉反馈
   ├── 加载状态指示器
   ├── 成功/错误消息的图标和颜色
   └── 平滑的动画过渡

2. 交互优化
   ├── 防止重复提交
   ├── 自动清空表单
   └── 自动隐藏消息

3. 错误处理
   ├── 友好的错误消息
   ├── 自动重试提示
   └── 详细的错误信息

4. 响应式设计
   ├── 移动端友好的表单布局
   ├── 触摸友好的按钮大小
   └── 适配不同屏幕尺寸
*/

