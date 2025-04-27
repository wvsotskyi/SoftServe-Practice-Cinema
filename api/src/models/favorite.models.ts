/**
 * @swagger
 * components:
 *   schemas:
 *     FavoriteRequest:
 *       type: object
 *       required:
 *         - movieId
 *       properties:
 *         movieId:
 *           type: integer
 *           example: 1
 * 
 *     FavoriteResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 *         movieId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00Z"
 *         movie:
 *           $ref: '#/components/schemas/Movie'
 * 
 *     FavoritesListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/FavoriteResponse'
 */