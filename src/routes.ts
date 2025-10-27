import { Router } from 'express';
import type { SqliteDatabase } from './db';
import { getAllMovies, createMovie } from './db';

/**
 * 为了在路由中访问 db，这里声明 Express Request 的扩展。
 */
declare module 'express-serve-static-core' {
  interface Request {
    db?: SqliteDatabase;
  }
}

export const moviesRouter = Router();

/**
 * GET /api/movies
 * 返回所有电影列表。
 */
moviesRouter.get('/', async (req, res) => {
  try {
    if (!req.db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const movies = await getAllMovies(req.db);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

/**
 * POST /api/movies
 * 接收 { title, year }，创建新电影。
 */
moviesRouter.post('/', async (req, res) => {
  try {
    if (!req.db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }
    const { title, year } = req.body as { title?: string; year?: number };

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Invalid title' });
    }
    if (typeof year !== 'number' || !Number.isInteger(year)) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    const movie = await createMovie(req.db, title.trim(), year);
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create movie' });
  }
});
