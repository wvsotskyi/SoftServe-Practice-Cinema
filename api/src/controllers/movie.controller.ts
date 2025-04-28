import { Request, Response } from "express";
import { getMovies, getMovieById, searchMovies } from "@services/movie.service.js";
import { APIResponse } from "@utils/apiResponse.js";

export const getAllMoviesController = async (req: Request, res: Response) => {
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

export const getMovieController = async (req: Request, res: Response) => {
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

export const searchMoviesController = async (req: Request, res: Response) => {
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