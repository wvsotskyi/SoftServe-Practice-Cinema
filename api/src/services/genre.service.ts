import { Genre } from '@prisma/client';
import prisma from '@utils/db.js';

export async function getAllGenres(): Promise<Genre[]> {
  return await prisma.genre.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};

export async function getGenreById(id: number): Promise<Genre | null> {
  return await prisma.genre.findUnique({
    where: { id }
  });
};