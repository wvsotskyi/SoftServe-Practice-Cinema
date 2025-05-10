import { Router } from 'express';
import {
  addFavoriteController,
  removeFavoriteController,
  getFavoritesController,
  checkFavoriteController
} from '@controllers/favorite.controller.js';
import { authenticate } from '@middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add movie to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteRequest'
 *     responses:
 *       201:
 *         description: Movie added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, async (req, res, next) => {
    try {
        await addFavoriteController(req, res);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /favorites/{movieId}:
 *   delete:
 *     summary: Remove movie from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to remove from favorites
 *     responses:
 *       200:
 *         description: Movie removed from favorites
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Favorite not found
 */
router.delete('/:movieId', authenticate, async (req, res, next) => {
    try {
        await removeFavoriteController(req, res);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user's favorite movies
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite movies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoritesListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, async (req, res, next) => {
    try {
        await getFavoritesController(req, res);
    } catch (error) {
        next(error);
    }
});
/**
 * @swagger
 * /favorites/{movieId}/check:
 *   get:
 *     summary: Check if movie is in favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to check
 *     responses:
 *       200:
 *         description: Favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFavorite:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get('/:movieId/check', authenticate, async (req, res, next) => {
    try {
        await checkFavoriteController(req, res);
    } catch (error) {
        next(error);
    }
});
export default router;