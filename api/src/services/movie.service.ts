import prisma from "@utils/db.js";
import { Movie, Cast, Genre } from "../../generated/prisma/default.js";

export type MovieWithRelations = Movie & {
  genres: Genre[];
  cast: Cast[];
};

export const getMovies = async (): Promise<MovieWithRelations[]> => {
  return await prisma.movie.findMany({
    include: {
      genres: true,
      cast: {
        orderBy: {
          order: "asc", // Order cast by their appearance order
        },
      },
    },
    orderBy: {
      releaseDate: "desc", // Newest movies first
    },
  });
};

export const getMovieById = async (id: number) => {
    if (!id || isNaN(id)) {
      throw new Error('Invalid movie ID');
    }
  
    return await prisma.movie.findUnique({
      where: { id: Number(id) }, 
      include: {
        genres: true,
        cast: {
          orderBy: { order: 'asc' }
        }
      }
    });
  };

interface MovieSearchParams {
    genres?: string | string[];
    year?: number | string;
    ageGroup?: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | string;
    minLength?: number | string;
    maxLength?: number | string;
    language?: string;
    query?: string;
    page?: number | string;
    limit?: number | string;
  }
  
  export const searchMovies = async (params: MovieSearchParams) => {
    const {
      genres,
      year,
      ageGroup,
      minLength,
      maxLength,
      language,
      query,
      page = 1,
      limit = 20
    } = params;
  
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
  
    const where: any = {};
  
    // Text search (title or overview)
    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          overview: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ];
    }
  
    // Genre filter (accepts comma-separated string or array)
    if (genres) {
      const genreArray = Array.isArray(genres) 
        ? genres 
        : String(genres).split(',');
  
      where.genres = {
        some: {
          id: {
            in: genreArray.map(id => Number(id)).filter(id => !isNaN(id))
          }
        }
      };
    }
  
    // Year filter
    if (year) {
      const yearNumber = Number(year);
      if (!isNaN(yearNumber)) {
        where.releaseDate = {
          gte: new Date(`${yearNumber}-01-01`),
          lt: new Date(`${yearNumber + 1}-01-01`)
        };
      }
    }
  
    // Age rating filter
    if (ageGroup) {
      const rating = String(ageGroup).toUpperCase();
      if (['G', 'PG', 'PG-13', 'R', 'NC-17'].includes(rating)) {
        where.adult = {
          equals: rating === 'R' || rating === 'NC-17'
        };
      }
    }
  
    // Runtime filters
    if (minLength || maxLength) {
      where.runtime = {};
      const min = Number(minLength);
      const max = Number(maxLength);
      
      if (!isNaN(min)) where.runtime.gte = min;
      if (!isNaN(max)) where.runtime.lte = max;
    }
  
    // Language filter
    if (language) {
      where.originalLanguage = {
        equals: language,
        mode: 'insensitive'
      };
    }
  
    const [movies, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where,
        include: {
          genres: true,
          cast: {
            orderBy: { order: 'asc' },
            take: 5
          }
        },
        skip,
        take: limitNumber,
        orderBy: {
          voteAverage: 'desc'
        }
      }),
      prisma.movie.count({ where })
    ]);
  
    return {
      data: movies,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber)
      }
    };
  };