import { Favorite, Movie } from '@prisma/client';
import prisma from '@utils/db.js';

export async function addFavorite(userId: number, movieId: number): Promise<Favorite & { movie: Movie }> {
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

export async function removeFavorite(userId: number, movieId: number): Promise<void> {
  await prisma.favorite.delete({
    where: {
      userId_movieId: {
        userId,
        movieId
      }
    }
  });
};

export async function getUserFavorites(userId: number): Promise<(Favorite & { movie: Movie })[]> {
  return await prisma.favorite.findMany({
    where: { userId },
    include: { movie: true },
    orderBy: { createdAt: 'desc' }
  });
};

export async function isMovieFavorite(userId: number, movieId: number): Promise<boolean> {
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