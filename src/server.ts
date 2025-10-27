import express from 'express';
import cors from 'cors';
import path from 'path';
import { initDatabase } from './db';
import { moviesRouter } from './routes';

/**
 * 启动 Express 服务器，初始化数据库并挂载路由。
 */
async function startServer(): Promise<void> {
  const app = express();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  app.use(cors());
  app.use(express.json());

  // 静态资源
  app.use(express.static(path.join(process.cwd(), 'public')));

  const db = await initDatabase();

  // 将 db 注入到请求对象
  app.use((req, _res, next) => {
    req.db = db;
    next();
  });

  app.use('/api/movies', moviesRouter);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
