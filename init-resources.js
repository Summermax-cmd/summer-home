/**
 * 资源初始化脚本
 * 用于初始化 resources 表并插入预定义资源
 */

const { getDatabase } = require('./database');

const db = getDatabase();

console.log('正在初始化资源数据库...');

// 等待数据库初始化完成
setTimeout(() => {
    // 查询所有资源
    db.all('SELECT * FROM resources', [], (err, rows) => {
        if (err) {
            console.error('查询失败:', err.message);
            db.close();
            return;
        }
        
        console.log('\n已加载的资源:');
        console.log('='.repeat(80));
        
        if (rows.length === 0) {
            console.log('暂无资源');
        } else {
            rows.forEach((row, index) => {
                console.log(`${index + 1}. [${row.resource_type}] ${row.resource_key}`);
                console.log(`   描述: ${row.description || '无'}`);
                console.log(`   URL: ${row.resource_url}`);
                console.log(`  状态: ${row.is_active ? '✓ 激活' : '✗ 停用'}`);
                console.log('-'.repeat(80));
            });
        }
        
        console.log(`\n总共 ${rows.length} 个资源\n`);
        
        // 关闭数据库连接
        db.close((err) => {
            if (err) {
                console.error('关闭数据库失败:', err.message);
            } else {
                console.log('数据库连接已关闭');
            }
            process.exit(0);
        });
    });
}, 1000);

