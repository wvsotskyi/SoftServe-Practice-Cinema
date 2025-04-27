import { Request, Response } from 'express';
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  isMovieFavorite
} from '@services/favorite.service.js';
import { APIResponse } from '@utils/apiResponse.js';

export const addFavoriteController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { movieId } = req.body;

    if (!userId) throw new Error('Authentication required');
    if (!movieId) throw new Error('Movie ID is required');

    const favorite = await addFavorite(userId, Number(movieId));
    
    return APIResponse(res, {
      status: 201,
      message: 'Movie added to favorites',
      data: favorite
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to add favorite'
    });
  }
};

export const removeFavoriteController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { movieId } = req.params;

    if (!userId) throw new Error('Authentication required');

    await removeFavorite(userId, Number(movieId));
    
    return APIResponse(res, {
      status: 200,
      message: 'Movie removed from favorites'
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to remove favorite'
    });
  }
};

export const getFavoritesController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) throw new Error('Authentication required');

    const favorites = await getUserFavorites(userId);
    
    return APIResponse(res, {
      status: 200,
      message: 'Favorites retrieved successfully',
      data: favorites
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to get favorites'
    });
  }
};

export const checkFavoriteController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { movieId } = req.params;

    if (!userId) throw new Error('Authentication required');

    const isFavorite = await isMovieFavorite(userId, Number(movieId));
    
    return APIResponse(res, {
      status: 200,
      message: 'Favorite status checked',
      data: { isFavorite }
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to check favorite status'
    });
  }
};