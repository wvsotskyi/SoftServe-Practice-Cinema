import express from 'express';
import { authenticate, verifyAdmin } from '@middlewares/auth.middleware.js';
import { getFiltersController, getFilteredShowtimesController, createShowtimeController, updateShowtimeController, deleteShowtimeController } from '@controllers/showtime.controller.js';

const router = express.Router();


/**
 * @swagger
 * /showtimes/filters:
 *   get:
 *     summary: Get filter options for showtimes (genres, dates, times)
 *     tags: [Showtime]
 *     responses:
 *       200:
 *         description: Filter options
 */
router.get('/filters', async (req, res, next) => {
  try {
    await getFiltersController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get showtimes grouped by movie with optional filters
 *     tags: [Showtime]
 *     parameters:
 *       - in: query
 *         name: genreId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "2025-05-09,2025-05-10"
 *         description: Comma-separated list of dates
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *           example: "14:00,17:30"
 *         description: Comma-separated list of times
 *     responses:
 *       200:
 *         description: Grouped showtimes by movie
 */
router.get('/', async (req, res, next) => {
  try {
    await getFilteredShowtimesController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime
 *     tags: [Showtime]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId, hallId, date, time, price]
 *             properties:
 *               movieId:
 *                 type: integer
 *               hallId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 example: "19:30"
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Showtime created
 */
router.post('/', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await createShowtimeController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /showtimes/{id}:
 *   put:
 *     summary: Update a showtime
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *               hallId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 example: "20:00"
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Showtime updated
 */
router.put('/:id', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await updateShowtimeController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /showtimes/{id}:
 *   delete:
 *     summary: Delete a showtime
 *     tags: [Showtime]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete('/:id', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await deleteShowtimeController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;