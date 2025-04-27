/**
 * @swagger
 * components:
 *   schemas:
 *     ShowtimeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         time:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T18:30:00Z"
 *         price:
 *           type: number
 *           format: float
 *           example: 12.50
 *         hall:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "Hall A"
 *         availableSeats:
 *           type: integer
 *           example: 50
 * 
 *     MovieShowtimesResponse:
 *       type: object
 *       properties:
 *         movieId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Inception"
 *         posterPath:
 *           type: string
 *           example: "/inception.jpg"
 *         showtimes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ShowtimeResponse'
 */