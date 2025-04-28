import { Router } from 'express';
import { getShowtimesController } from '@controllers/showtime.controller.js';

const router = Router();

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get showtimes grouped by movie with filtering options
 *     tags: [Showtimes]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-15"
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T09:00:00"
 *         description: Filter showtimes after this time
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T23:00:00"
 *         description: Filter showtimes before this time
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filter by genre ID
 *       - in: query
 *         name: movieId
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filter by specific movie ID
 *     responses:
 *       200:
 *         description: List of movies with their showtimes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovieShowtimesResponse'
 *       400:
 *         description: Bad request
 */
router.get('/', async (req, res, next) => {
  try {
    await getShowtimesController(req, res);
  } catch (error) {
    next(error);
  }
});
export default router;