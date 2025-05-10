import { Router } from 'express';
import { addMovieFromTMDBController, searchTMDBMoviesController } from '@controllers/tmdb.controller.js';
import { authenticate, verifyAdmin } from '@middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /tmdb/search:
 *   get:
 *     summary: Search movies on TMDB (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie title to search for
 *     responses:
 *       200:
 *         description: List of matching movies from TMDB
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TMDBMovieResult'
 *       400:
 *         description: Missing search query
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/search', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await searchTMDBMoviesController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /tmdb/movies:
 *   post:
 *     summary: Add a movie from TMDB by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tmdbId
 *             properties:
 *               tmdbId:
 *                 type: integer
 *                 example: 27205
 *                 description: TMDB movie ID
 *     responses:
 *       201:
 *         description: Movie added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid TMDB ID
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Failed to add movie from TMDB
 */
router.post('/movies', authenticate, verifyAdmin, async (req, res, next) => {
  try {
    await addMovieFromTMDBController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;