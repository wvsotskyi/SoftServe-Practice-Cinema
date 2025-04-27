import prisma from '@utils/db.js';
import { Favorite, Movie } from '../../generated/prisma/default.js';

export const addFavorite = async (userId: number, movieId: number): Promise<Favorite & { movie: Movie }> => {
  return await prisma.favorite.create({
    data: {
      userId,
      movieId
    },
    include: {
      movie: true
    }
  });
};

export const removeFavorite = async (userId: number, movieId: number): Promise<void> => {
  await prisma.favorite.delete({
    where: {
      userId_movieId: {
        userId,
        movieId
      }
    }
  });
};

export const getUserFavorites = async (userId: number): Promise<(Favorite & { movie: Movie })[]> => {
  return await prisma.favorite.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { createdAt: 'desc' }
  });
};

export const isMovieFavorite = async (userId: number, movieId: number): Promise<boolean> => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_movieId: {
        userId,
        movieId
      }
    }
  });
  return !!favorite;
};