import { Request, Response } from 'express';
import { getAllGenres, getGenreById } from '@services/genre.service.js';
import { APIResponse } from '@utils/apiResponse.js';

export async function getAllGenresController(req: Request, res: Response) {
  try {
    const genres = await getAllGenres();
    return APIResponse(res, {
      status: 200,
      message: 'Genres retrieved successfully',
      data: genres
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || 'Failed to retrieve genres'
    });
  }
};

export async function getGenreByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const genre = await getGenreById(Number(id));

    if (!genre) {
      return APIResponse(res, {
        status: 404,
        message: 'Genre not found'
      });
    }

    return APIResponse(res, {
      status: 200,
      message: 'Genre retrieved successfully',
      data: genre
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to retrieve genre'
    });
  }
};