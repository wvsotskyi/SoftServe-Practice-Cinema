import { Router } from 'express';
import {
  getAllGenresController,
  getGenreByIdController
} from '@controllers/genre.controller.js';

const router = Router();

/**
 * @swagger
 * /genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: List of all genres
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenreListResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res, next) => {
  try {
    await getAllGenresController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /genres/{id}:
 *   get:
 *     summary: Get genre by ID
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       404:
 *         description: Genre not found
 *       400:
 *         description: Bad request
 */
router.get('/:id', async (req, res, next) => {
    try {
      await getGenreByIdController(req, res);
    } catch (error) {
      next(error);
    }
  });
export default router;