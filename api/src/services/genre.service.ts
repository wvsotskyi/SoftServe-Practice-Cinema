import prisma from '@utils/db.js';
import { Genre } from '../../generated/prisma/default.js';

export const getAllGenres = async (): Promise<Genre[]> => {
  return await prisma.genre.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};

export const getGenreById = async (id: number): Promise<Genre | null> => {
  return await prisma.genre.findUnique({
    where: { id }
  });
};