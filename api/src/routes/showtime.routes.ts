import { Router } from 'express';
import {
  getShowtimesGroupedByMovieController,
  getShowtimeFilterOptionsController,
  createShowtimeController,
  updateShowtimeController,
  deleteShowtimeController,
} from '@controllers/showtime.controller.js';
import { authenticate, verifyAdmin } from '@middlewares/auth.middleware.js';

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

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - hallId
 *               - time
 *               - price
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie
 *                 example: 1
 *               hallId:
 *                 type: integer
 *                 description: ID of the hall
 *                 example: 1
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Showtime date and time
 *                 example: "2023-12-25T18:00:00Z"
 *               price:
 *                 type: number
 *                 description: Ticket price
 *                 example: 12.99
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Showtime created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     movieId:
 *                       type: integer
 *                     hallId:
 *                       type: integer
 *                     time:
 *                       type: string
 *                       format: date-time
 *                     price:
 *                       type: number
 *                     movie:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         runtime:
 *                           type: integer
 *                     hall:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *       400:
 *         description: Bad request - missing or invalid fields
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Not found - movie or hall doesn't exist
 *       409:
 *         description: Conflict - hall is already booked at this time
 *       500:
 *         description: Internal server error
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
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: ID of the movie
 *                 example: 1
 *               hallId:
 *                 type: integer
 *                 description: ID of the hall
 *                 example: 1
 *               time:
 *                 type: string
 *                 format: date-time
 *                 description: Showtime date and time
 *                 example: "2023-12-25T18:00:00Z"
 *               price:
 *                 type: number
 *                 description: Ticket price
 *                 example: 12.99
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Showtime updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Showtime'
 *       400:
 *         description: Bad request - invalid fields
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Not found - showtime, movie or hall doesn't exist
 *       409:
 *         description: Conflict - hall is already booked at this time
 *       500:
 *         description: Internal server error
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
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Showtime deleted successfully
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Not found - showtime doesn't exist
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await deleteShowtimeController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;