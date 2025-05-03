import { Router } from 'express';
import {
  getHallWithSeatsController,
  getHallSizeController,
  getAllHallsBasicController,
  getAllHallsController
} from '@controllers/hall.controller.js';

const router = Router();

/**
 * @swagger
 * /halls/{hallId}/seats:
 *   get:
 *     summary: Get hall with all seats and availability status
 *     tags: [Halls]
 *     parameters:
 *       - in: path
 *         name: hallId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hall ID
 *       - in: query
 *         name: showtimeId
 *         schema:
 *           type: integer
 *         description: Optional showtime ID to check seat availability
 *     responses:
 *       200:
 *         description: Hall details with seats and availability
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HallWithSeats'
 *       404:
 *         description: Hall not found
 *       500:
 *         description: Internal server error
 */
router.get('/:hallId/seats', async (req, res, next) => {
  try {
    await getHallWithSeatsController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /halls/{hallId}/size:
 *   get:
 *     summary: Get hall dimensions (rows and seats per row)
 *     tags: [Halls]
 *     parameters:
 *       - in: path
 *         name: hallId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hall ID
 *     responses:
 *       200:
 *         description: Hall dimensions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HallSize'
 *       404:
 *         description: Hall not found or has no seats
 *       500:
 *         description: Internal server error
 */
router.get('/:hallId/size', async (req, res, next) => {
  try {
    await getHallSizeController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /halls:
 *   get:
 *     summary: Get all halls with seat information
 *     tags: [Halls]
 *     parameters:
 *       - in: query
 *         name: showtimeId
 *         schema:
 *           type: integer
 *         description: Optional showtime ID to check seat availability
 *     responses:
 *       200:
 *         description: List of all halls with seats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HallWithSeats'
 *       500:
 *         description: Internal server error
 */
router.get('/', async (req, res, next) => {
  try {
    await getAllHallsController(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /halls/basic:
 *   get:
 *     summary: Get basic hall information (without seats)
 *     tags: [Halls]
 *     responses:
 *       200:
 *         description: List of halls with basic info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BasicHallInfo'
 *       500:
 *         description: Internal server error
 */
router.get('/basic', async (req, res, next) => {
  try {
    await getAllHallsBasicController(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;