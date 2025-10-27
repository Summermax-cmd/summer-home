import sqlite3 from 'sqlite3';
import path from 'path';

/**
 * 将 sqlite3 的回调式 API 简单 Promise 化。
 */
function promisifyRun(db: sqlite3.Database, sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function promisifyAll<T = unknown>(db: sqlite3.Database, sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}

export type SqliteDatabase = sqlite3.Database;

/**
 * 初始化并返回 SQLite 数据库连接。
 * - 数据库文件位于项目根目录下的 `data.sqlite`。
 * - 启动时若不存在 `movies` 表，则创建，包含 id/title/year 字段。
 */
export async function initDatabase(): Promise<SqliteDatabase> {
  const dbFilePath = path.join(process.cwd(), 'data.sqlite');
  sqlite3.verbose();
  const db = new sqlite3.Database(dbFilePath);

  await promisifyRun(
    db,
    `CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      year INTEGER NOT NULL
    );`
  );

  return db;
}

/**
 * 获取所有电影记录。
 * @param db SQLite 数据库实例
 */
export async function getAllMovies(db: SqliteDatabase): Promise<Array<{ id: number; title: string; year: number }>> {
  return promisifyAll(db, `SELECT id, title, year FROM movies ORDER BY id ASC`);
}

/**
 * 新增电影记录。
 * @param db SQLite 数据库实例
 * @param title 电影标题
 * @param year 上映年份
 */
export async function createMovie(
  db: SqliteDatabase,
  title: string,
  year: number
): Promise<{ id: number; title: string; year: number }> {
  const result = await promisifyRun(db, `INSERT INTO movies (title, year) VALUES (?, ?)`, [title, year]);
  const id = result.lastID as number;
  return { id, title, year };
}
