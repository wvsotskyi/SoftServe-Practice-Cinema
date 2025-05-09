import { Request, Response } from "express";
import { getMovies, getMovieById, searchMovies, deleteMovieWithRelations, updateMovieWithRelations } from "@services/movie.service.js";
import { APIResponse } from "@utils/apiResponse.js";
import { verifyAdmin } from "@middlewares/auth.middleware.js";
import prisma from "@utils/db.js";

export async function getAllMoviesController (req: Request, res: Response)  {
  try {
    const movies = await getMovies();
    return APIResponse(res, {
      status: 200,
      message: "Movies retrieved successfully",
      data: movies,
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || "Failed to fetch movies",
    });
  }
};

export async function getMovieController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const movie = await getMovieById(Number(id));

    if (!movie) {
      return APIResponse(res, {
        status: 404,
        message: "Movie not found",
      });
    }

    return APIResponse(res, {
      status: 200,
      message: "Movie retrieved successfully",
      data: movie,
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || "Failed to fetch movie",
    });
  }
};

export async function searchMoviesController  (req: Request, res: Response)  {
  try {
    const result = await searchMovies(req.query);

    return APIResponse(res, {
      status: 200,
      message: "Movies retrieved successfully",
      data: {
        movies: result.data,
        pagination: result.pagination
      }
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || "Failed to search movies",
    });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieUpdateInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         originalTitle:
 *           type: string
 *         originalLanguage:
 *           type: string
 *         overview:
 *           type: string
 *         posterPath:
 *           type: string
 *           nullable: true
 *         backdropPath:
 *           type: string
 *           nullable: true
 *         releaseDate:
 *           type: string
 *           format: date-time
 *         productionCountries:
 *           type: array
 *           items:
 *             type: string
 *         runtime:
 *           type: integer
 *           nullable: true
 *         budget:
 *           type: integer
 *           nullable: true
 *         revenue:
 *           type: integer
 *           nullable: true
 *         trailerKey:
 *           type: string
 *           nullable: true
 *         voteAverage:
 *           type: number
 *           nullable: true
 *         voteCount:
 *           type: integer
 *           nullable: true
 *         adult:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [RELEASED, UPCOMING, IN_PRODUCTION]
 *         genres:
 *           type: array
 *           items:
 *             type: integer
 *         cast:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CastInput'
 * 
 *     CastInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           nullable: true
 *         tmdbId:
 *           type: integer
 *         name:
 *           type: string
 *         character:
 *           type: string
 *         profilePath:
 *           type: string
 *           nullable: true
 *         order:
 *           type: integer
 */
export async function updateMovieController  (req: Request, res: Response)  {
  try {
    await verifyAdmin(req, res, () => {});
    
    const { id } = req.params;
    const updateData = req.body;

    if (!id || isNaN(Number(id))) {
      return APIResponse(res, {
        status: 400,
        message: "Invalid movie ID"
      });
    }

    // Convert date if provided
    if (updateData.releaseDate) {
      updateData.releaseDate = new Date(updateData.releaseDate);
    }

    const updatedMovie = await updateMovieWithRelations(Number(id), updateData);

    return APIResponse(res, {
      status: 200,
      message: "Movie updated successfully",
      data: updatedMovie
    });

  } catch (error: any) {
    if (error.message === 'Unauthorized - Admin access required') {
      return APIResponse(res, {
        status: 403,
        message: error.message
      });
    }

    return APIResponse(res, {
      status: 500,
      message: error.message || "Failed to update movie"
    });
  }
};

export async function deleteMovieController  (req: Request, res: Response)  {
  try {
    await verifyAdmin(req, res, () => {});
    
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return APIResponse(res, {
        status: 400,
        message: "Invalid movie ID"
      });
    }

    await deleteMovieWithRelations(Number(id));

    return APIResponse(res, {
      status: 200,
      message: "Movie and all related data deleted successfully"
    });

  } catch (error: any) {
    if (error.message === 'Unauthorized - Admin access required') {
      return APIResponse(res, {
        status: 403,
        message: error.message
      });
    }

    return APIResponse(res, {
      status: 500,
      message: error.message || "Failed to delete movie"
    });
  }
};