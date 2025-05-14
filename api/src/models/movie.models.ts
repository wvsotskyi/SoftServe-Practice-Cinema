/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       required:
 *         - title
 *         - overview
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the movie
 *         title:
 *           type: string
 *           description: The movie title
 *         overview:
 *           type: string
 *           description: The movie description
 *         releaseDate:
 *           type: string
 *           format: date-time
 *           description: The movie release date
 *         genres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Genre'
 *         cast:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Cast'
 * 
 *     Genre:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 * 
 *     Cast:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         character:
 *           type: string
 *         profilePath:
 *           type: string
 * 
 *     MovieSearchResponse:
 *       type: object
 *       properties:
 *         movies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Movie'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total number of movies matching filters
 *             page:
 *               type: integer
 *               description: Current page number
 *             limit:
 *               type: integer
 *               description: Number of items per page
 *             totalPages:
 *               type: integer
 *               description: Total number of pages available
 */