import { Router } from 'express';
import { deleteMovieController, getAllMoviesController, getMovieController, searchMoviesController, updateMovieController } from '@controllers/movie.controller.js';
import { authenticate, verifyAdmin } from '@middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: List of all movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/', async (req, res, next) => {
  try {
    await getAllMoviesController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /movies/search:
 *   get:
 *     summary: Search movies with optional filters
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search text in title or overview
 *       - in: query
 *         name: genres
 *         schema:
 *           type: string
 *         description: Comma-separated genre IDs (e.g., "1,2,3")
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by release year
 *       - in: query
 *         name: ageGroup
 *         schema:
 *           type: string
 *           enum: [G, PG, PG-13, R, NC-17]
 *         description: Filter by age rating
 *       - in: query
 *         name: minLength
 *         schema:
 *           type: integer
 *         description: Minimum runtime in minutes
 *       - in: query
 *         name: maxLength
 *         schema:
 *           type: integer
 *         description: Maximum runtime in minutes
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by original language (e.g., "en")
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of filtered movies with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovieSearchResponse'
 */
router.get('/search', async (req, res, next) => {
  try {
    await searchMoviesController(req, res);
  } catch (error) {
    next(error);
  }
});


/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    await getMovieController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update a movie with all relations (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieUpdateInput'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await updateMovieController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete a movie and all related data (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie and all related data deleted successfully
 *       400:
 *         description: Invalid movie ID
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await deleteMovieController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;