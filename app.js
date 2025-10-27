const express = require('express');
const cors = require('cors');
const { getDatabase } = require('./database');

/**
 * Express 服务器主文件
 * 实现留言系统的 API 端点
 */

const app = express();
const PORT = process.env.PORT || 3000;

// 获取数据库连接
const db = getDatabase();

// 中间件配置
app.use(cors()); // 启用 CORS 支持
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 静态文件服务 - 提供 HTML、CSS、JS 文件
app.use(express.static('.'));

/**
 * 中间件：验证请求数据
 * 检查必需字段是否存在
 */
const validateContactData = (req, res, next) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: '缺少必需字段：name, email, message'
        });
    }
    
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: '邮箱格式不正确'
        });
    }
    
    next();
};

/**
 * 中间件：检查是否为本地访问
 * 仅允许 localhost 访问私有端点
 */
const checkLocalhost = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const isLocalhost = clientIP === '127.0.0.1' || 
                       clientIP === '::1' || 
                       clientIP === '::ffff:127.0.0.1' ||
                       req.get('host')?.includes('localhost');
    
    if (!isLocalhost) {
        return res.status(403).json({
            success: false,
            message: '此端点仅允许本地访问'
        });
    }
    
    next();
};

/**
 * POST /api/contact
 * 接收访客留言并保存到数据库
 */
app.post('/api/contact', validateContactData, (req, res) => {
    const { name, email, message } = req.body;
    
    const insertSQL = `
        INSERT INTO messages (name, email, message) 
        VALUES (?, ?, ?)
    `;
    
    db.run(insertSQL, [name, email, message], function(err) {
        if (err) {
            console.error('保存留言失败:', err.message);
            return res.status(500).json({
                success: false,
                message: '保存留言失败，请稍后重试'
            });
        }
        
        console.log(`新留言已保存，ID: ${this.lastID}`);
        res.status(201).json({
            success: true,
            message: '留言已成功提交',
            data: {
                id: this.lastID,
                name,
                email,
                message,
                timestamp: new Date().toISOString()
            }
        });
    });
});

/**
 * GET /api/messages
 * 获取所有留言（仅限本地访问）
 */
app.get('/api/messages', checkLocalhost, (req, res) => {
    const selectSQL = `
        SELECT id, name, email, message, timestamp 
        FROM messages 
        ORDER BY timestamp DESC
    `;
    
    db.all(selectSQL, [], (err, rows) => {
        if (err) {
            console.error('查询留言失败:', err.message);
            return res.status(500).json({
                success: false,
                message: '查询留言失败'
            });
        }
        
        res.json({
            success: true,
            message: '查询成功',
            data: rows,
            count: rows.length
        });
    });
});

/**
 * 根路径 - 重定向到主页面
 */
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

/**
 * 健康检查端点
 */
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '服务器运行正常',
        timestamp: new Date().toISOString()
    });
});

/**
 * 404 处理
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的端点不存在'
    });
});

/**
 * 错误处理中间件
 */
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误'
    });
});

/**
 * 启动服务器
 */
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`健康检查: http://localhost:${PORT}/health`);
    console.log(`留言提交: http://localhost:${PORT}/api/contact`);
    console.log(`查看留言: http://localhost:${PORT}/api/messages (仅本地访问)`);
});

/**
 * 优雅关闭
 */
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    db.close((err) => {
        if (err) {
            console.error('关闭数据库连接失败:', err.message);
        } else {
            console.log('数据库连接已关闭');
        }
        process.exit(0);
    });
});

module.exports = app;
