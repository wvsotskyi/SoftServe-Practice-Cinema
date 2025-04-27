import prisma from '@utils/db.js';
import { Showtime } from '../../generated/prisma/default.js';

interface ShowtimeFilters {
  date?: string;
  timeRange?: {
    start?: string;
    end?: string;
  };
  genreId?: number;
  movieId?: number;
}

export const getShowtimesGroupedByMovie = async (filters: ShowtimeFilters = {}) => {
    const { date, timeRange, genreId, movieId } = filters;
    
    const dateFilter = date ? {
      gte: new Date(`${date}T00:00:00`),
      lt: new Date(`${date}T23:59:59`)
    } : undefined;
  
    const timeFilter = timeRange ? {
      ...(timeRange.start && { gte: new Date(timeRange.start) }),
      ...(timeRange.end && { lt: new Date(timeRange.end) })
    } : undefined;
  
    return await prisma.movie.findMany({
      where: {
        id: movieId,
        genres: genreId ? { some: { id: genreId } } : undefined,
        showtimes: { some: { time: { ...dateFilter, ...timeFilter } } }
      },
      include: {
        showtimes: {
          where: { time: { ...dateFilter, ...timeFilter } },
          include: {
            hall: {
              include: {
                seats: true // Include seats to calculate availability
              }
            },
            bookings: {
              select: {
                seats: { select: { id: true } }
              }
            }
          },
          orderBy: { time: 'asc' }
        }
      },
      orderBy: { title: 'asc' }
    });
  };