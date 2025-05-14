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
 *           type: integer
 *           example: 3
 *         number:
 *           type: integer
 *           example: 12
 *         hallId:
 *           type: integer
 *           example: 2
 * 
 *     Showtimes:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         movieId:
 *           type: integer
 *           example: 10
 *         hallId:
 *           type: integer
 *           example: 2
 *         time:
 *           type: string
 *           format: date-time
 *           example: "2024-12-15T18:30:00Z"
 *         price:
 *           type: number
 *           format: float
 *           example: 12.50
 * 
 *     BookingRequest:
 *       type: object
 *       required:
 *         - showtimeId
 *         - seatIds
 *       properties:
 *         showtimeId:
 *           type: integer
 *           example: 5
 *         seatIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2, 3]
 * 
 *     BookingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 1
 *         showtime:
 *           $ref: '#/components/schemas/Showtime'
 *         seats:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Seat'
 *         totalPrice:
 *           type: number
 *           format: float
 *           example: 37.50
 *         status:
 *           type: string
 *           enum: [CONFIRMED, CANCELLED, COMPLETED]
 *           example: CONFIRMED
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-12-01T10:15:30Z"
 * 
 *     BookingUpdateRequest:
 *       type: object
 *       properties:
 *         seatIds:
 *           type: array
 *           items:
 *             type: integer
 *           example: [4, 5]
 *         status:
 *           type: string
 *           enum: [CONFIRMED, CANCELLED, COMPLETED]
 *           example: CANCELLED
 */