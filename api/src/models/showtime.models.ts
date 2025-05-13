/**
 * @swagger
 * components:
 *   schemas:
 *     Seat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         row:
 *           type: string
 *           example: "A"
 *         number:
 *           type: integer
 *           example: 5
 *         isAvailable:
 *           type: boolean
 *           example: true
 *
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 101
 *         showtimeId:
 *           type: integer
 *           example: 201
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Seat'
 *
 *     Hall:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "IMAX Hall"
 *         totalSeats:
 *           type: integer
 *           example: 100
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Seat'
 *
 *     ShowtimeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-04-05"
 *         time:
 *           type: string
 *           format: time
 *           example: "18:30"
 *         price:
 *           type: number
 *           format: float
 *           example: 12.50
 *         hall:
 *           $ref: '#/components/schemas/Hall'
 *         availableSeats:
 *           type: integer
 *           example: 75
 *
 *     MovieShowtimesResponse:
 *       type: object
 *       properties:
 *         id:
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
 *
 *     Showtime:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         movieId:
 *           type: integer
 *           example: 101
 *         hallId:
 *           type: integer
 *           example: 201
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-04-05"
 *         timeOfDaySeconds:
 *           type: integer
 *           example: 64800  # 18:00 in seconds
 *         price:
 *           type: number
 *           format: float
 *           example: 12.50
 *         movie:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 101
 *             title:
 *               type: string
 *               example: "The Matrix"
 *             runtime:
 *               type: integer
 *               example: 120
 *         hall:
 *           $ref: '#/components/schemas/Hall'
 */