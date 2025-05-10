import { Request, Response } from 'express';
import { addMovieFromTMDB, searchMoviesOnTMDB } from '@services/tmdb.service.js';
import { APIResponse } from '@utils/apiResponse.js';

export async function searchTMDBMoviesController(req: Request, res: Response) {
  try {
    // Verify admin role
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return APIResponse(res, {
        status: 400,
        message: 'Search query is required'
      });
    }

    const results = await searchMoviesOnTMDB(query);

    return APIResponse(res, {
      status: 200,
      message: 'TMDB movies retrieved successfully',
      data: results
    });

  } catch (error: any) {
    if (error.message === 'Unauthorized - Admin access required') {
      return APIResponse(res, {
        status: 403,
        message: error.message
      });
    }

    return APIResponse(res, {
      status: error.status || 500,
      message: error.message || 'Failed to search TMDB movies'
    });
  }
};

export async function addMovieFromTMDBController(req: Request, res: Response) {
  try {
    const { tmdbId } = req.body;

    if (!tmdbId || typeof tmdbId !== 'number') {
      return APIResponse(res, {
        status: 400,
        message: 'Valid TMDB ID is required'
      });
    }

    const movie = await addMovieFromTMDB(tmdbId);

    return APIResponse(res, {
      status: 201,
      message: 'Movie added successfully from TMDB',
      data: movie
    });

  } catch (error: any) {
    if (error.message === 'Unauthorized - Admin access required') {
      return APIResponse(res, {
        status: 403,
        message: error.message
      });
    }

    return APIResponse(res, {
      status: error.status || 500,
      message: error.message || 'Failed to add movie from TMDB'
    });
  }
};