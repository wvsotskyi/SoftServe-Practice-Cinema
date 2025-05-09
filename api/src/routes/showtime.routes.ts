import { Router } from 'express';
import {
  getShowtimesGroupedByMovieController,
  getShowtimeFilterOptionsController,
  createShowtimeController,
} from '@controllers/showtime.controller.js';
import { authenticated, verifyAdmin } from '@middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get showtimes grouped by movie with optional filters
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by specific date (YYYY-MM-DD)
 *       - in: query
 *         name: timeRange[start]
 *         schema:
 *           type: string
 *           format: time
 *         description: Start time for time range filter (HH:MM)
 *       - in: query
 *         name: timeRange[end]
 *         schema:
 *           type: string
 *           format: time
 *         description: End time for time range filter (HH:MM)
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: integer
 *         description: Filter by genre ID
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *         description: Filter by specific movie ID
 *     responses:
 *       200:
 *         description: List of movies with their showtimes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovieWithShowtimes'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res, next) => {
  try {
    await getShowtimesGroupedByMovieController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /showtimes/filters:
 *   get:
 *     summary: Get all available filter options for showtimes
 *     tags: [Showtimes]
 *     responses:
 *       200:
 *         description: Available filter options
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShowtimeFilterOptions'
 *       500:
 *         description: Internal server error
 */
router.get('/filters', async (req, res, next) => {
  try {
    await getShowtimeFilterOptionsController(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticated(), verifyAdmin, async (req, res, next) => {
  try {
    await createShowtimeController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;