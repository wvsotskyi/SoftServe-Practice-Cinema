import { Cast, Genre, Movie, Prisma } from "@prisma/client";
import prisma from "@utils/db.js";

export type MovieWithRelations = Movie & {
  genres: Genre[];
  cast: Cast[];
};

export async function getMovies (): Promise<MovieWithRelations[]>  {
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

export async function getMovieById (id: number)  {
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
  
  export async function searchMovies (params: MovieSearchParams)  {
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

  export async function updateMovieWithRelations (
    id: number,
    updateData: Prisma.MovieUpdateInput & {
      genres?: number[];
      cast?: Array<{
        id?: number;
        tmdbId: number;
        name: string;
        character: string;
        profilePath?: string | null;
        order: number;
      }>;
      productionCountries?: string[];
    }
  ): Promise<MovieWithRelations>  {
    return await prisma.$transaction(async (tx) => {
      // Handle cast updates
      if (updateData.cast) {
        // Delete existing cast not in new list
        await tx.cast.deleteMany({
          where: {
            movieId: id,
            NOT: {
              OR: [
                { id: { in: updateData.cast.filter(c => c.id).map(c => c.id!) } },
                { tmdbId: { in: updateData.cast.map(c => c.tmdbId) } }
              ]
            }
          }
        });
  
        // Upsert each cast member
        for (const castMember of updateData.cast) {
          await tx.cast.upsert({
            where: { 
              id: castMember.id || 0, // 0 will force create
              movieId: id
            },
            update: {
              tmdbId: castMember.tmdbId,
              name: castMember.name,
              character: castMember.character,
              profilePath: castMember.profilePath,
              order: castMember.order
            },
            create: {
              tmdbId: castMember.tmdbId,
              name: castMember.name,
              character: castMember.character,
              profilePath: castMember.profilePath,
              order: castMember.order,
              movieId: id
            }
          });
        }
        delete updateData.cast;
      }
  
      // Handle genre updates
      if (updateData.genres) {
        await tx.movie.update({
          where: { id },
          data: {
            genres: {
              set: updateData.genres.map(genreId => ({ id: genreId }))
            }
          }
        });
        delete updateData.genres;
      }
  
      const movieUpdatePayload: Prisma.MovieUpdateInput = {
        ...updateData
      };
  
      // Handle production countries separately
      if (updateData.productionCountries) {
        movieUpdatePayload.productionCountries = updateData.productionCountries;
        delete updateData.productionCountries;
      }
  
      // Update movie fields
      return await tx.movie.update({
        where: { id },
        data: movieUpdatePayload,
        include: {
          genres: true,
          cast: true,
          showtimes: true,
          favorites: true
        }
      });
    });
  };
  
  export async function deleteMovieWithRelations  (id: number): Promise<void>  {
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.cast.deleteMany({ where: { movieId: id } });
      await tx.favorite.deleteMany({ where: { movieId: id } });
      
      // Delete showtimes and their bookings
      const showtimes = await tx.showtime.findMany({
        where: { movieId: id },
        select: { id: true }
      });
      
      await tx.booking.deleteMany({
        where: { showtimeId: { in: showtimes.map(s => s.id) } }
      });
      
      await tx.showtime.deleteMany({ where: { movieId: id } });
      
      // Finally delete the movie
      await tx.movie.delete({ where: { id } });
    });
  };