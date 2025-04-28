/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Action"
 * 
 *     GenreListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Genre'
 */