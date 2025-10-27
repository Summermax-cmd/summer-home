const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * 数据库连接和初始化模块
 * 负责创建 SQLite 数据库连接和初始化 messages 表
 */

// 数据库文件路径
const dbPath = path.join(__dirname, 'messages.db');

/**
 * 创建数据库连接
 * @returns {sqlite3.Database} 数据库连接实例
 */
function createDatabase() {
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('数据库连接失败:', err.message);
        } else {
            console.log('成功连接到 SQLite 数据库');
        }
    });

    return db;
}

/**
 * 初始化数据库表
 * 创建 messages 表，包含 id, name, email, message, timestamp 字段
 * @param {sqlite3.Database} db 数据库连接实例
 */
function initializeTables(db) {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('创建表失败:', err.message);
        } else {
            console.log('messages 表已创建或已存在');
        }
    });
}

/**
 * 获取数据库实例
 * @returns {sqlite3.Database} 已初始化的数据库连接
 */
function getDatabase() {
    const db = createDatabase();
    initializeTables(db);
    return db;
}

module.exports = {
    getDatabase,
    createDatabase,
    initializeTables
};

