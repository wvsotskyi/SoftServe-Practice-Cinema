import { Genre } from '@prisma/client';
import prisma from '@utils/db.js';

interface ShowtimeFilters {
  date?: string;
  timeRange?: {
    start?: string;
    end?: string;
  };
  genreId?: number;
  movieId?: number;
}

interface ShowtimeFilterOptions {
  genres: Genre[];
  dates: string[];
  times: string[];
}

export async function getShowtimesGroupedByMovie  (filters: ShowtimeFilters = {})  {
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
              seats: true
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

export async function getShowtimeFilterOptions  (): Promise<ShowtimeFilterOptions>  {
  // Get all unique genres that have showtimes
  const genres = await prisma.genre.findMany({
    where: {
      movies: {
        some: {
          showtimes: {
            some: {}
          }
        }
      }
    },
    distinct: ['id'],
    orderBy: { name: 'asc' }
  });

  // Get all unique dates with showtimes (formatted as YYYY-MM-DD)
  const dateResults = await prisma.showtime.findMany({
    select: {
      time: true
    },
    distinct: ['time'],
    orderBy: { time: 'asc' }
  });

  // Extract unique dates in YYYY-MM-DD format
  const dates = [...new Set(
    dateResults.map(showtime =>
      showtime.time.toISOString().split('T')[0]
    )
  )];

  // Get all unique times (formatted as HH:MM)
  const timeResults = await prisma.showtime.findMany({
    select: {
      time: true
    },
    distinct: ['time'],
    orderBy: { time: 'asc' }
  });

  // Extract unique times in HH:MM format
  const times = [...new Set(
    timeResults.map(showtime =>
      showtime.time.toISOString().split('T')[1].substring(0, 5)
    )
  )];

  return {
    genres,
    dates,
    times
  };
};

interface CreateShowtimeInput {
  movieId: number;
  hallId: number;
  time: Date;
  price: number;
}

export async function createShowtime  (input: CreateShowtimeInput)  {
  // Validate movie exists
  const movieExists = await prisma.movie.findUnique({
    where: { id: input.movieId }
  });
  if (!movieExists) {
    throw new Error('Movie not found');
  }

  // Validate hall exists
  const hallExists = await prisma.hall.findUnique({
    where: { id: input.hallId },
    include: { seats: true }
  });
  if (!hallExists) {
    throw new Error('Hall not found');
  }

  // Check for time conflicts (30 minutes buffer)
  const conflictingShowtime = await prisma.showtime.findFirst({
    where: {
      hallId: input.hallId,
      time: {
        gte: new Date(input.time.getTime() - 30 * 60000), // 30 mins before
        lte: new Date(input.time.getTime() + 30 * 60000)  // 30 mins after
      }
    }
  });

  if (conflictingShowtime) {
    throw new Error('Hall is already booked at this time');
  }

  return await prisma.showtime.create({
    data: {
      movieId: input.movieId,
      hallId: input.hallId,
      time: input.time,
      price: input.price
    },
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          runtime: true
        }
      },
      hall: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export async function updateShowtime(id: number, updateData: Partial<CreateShowtimeInput>) {
  // Check if showtime exists
  const existingShowtime = await prisma.showtime.findUnique({
    where: { id }
  });

  if (!existingShowtime) {
    throw new Error('Showtime not found');
  }

  // Validate movie exists if being updated
  if (updateData.movieId) {
    const movieExists = await prisma.movie.findUnique({
      where: { id: updateData.movieId }
    });
    if (!movieExists) {
      throw new Error('Movie not found');
    }
  }

  // Validate hall exists if being updated
  if (updateData.hallId) {
    const hallExists = await prisma.hall.findUnique({
      where: { id: updateData.hallId }
    });
    if (!hallExists) {
      throw new Error('Hall not found');
    }
  }

  // Check for time conflicts (30 minutes buffer) if time is being updated
  if (updateData.time) {
    const conflictingShowtime = await prisma.showtime.findFirst({
      where: {
        id: { not: id }, // Exclude current showtime
        hallId: updateData.hallId || existingShowtime.hallId,
        time: {
          gte: new Date(updateData.time.getTime() - 30 * 60000),
          lte: new Date(updateData.time.getTime() + 30 * 60000)
        }
      }
    });

    if (conflictingShowtime) {
      throw new Error('Hall is already booked at this time');
    }
  }

  return await prisma.showtime.update({
    where: { id },
    data: updateData,
    include: {
      movie: {
        select: {
          id: true,
          title: true,
          runtime: true
        }
      },
      hall: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
}

export async function deleteShowtime(id: number) {
  // Check if showtime exists
  const showtime = await prisma.showtime.findUnique({
    where: { id }
  });

  if (!showtime) {
    throw new Error('Showtime not found');
  }

  // Delete associated bookings first if needed
  await prisma.booking.deleteMany({
    where: { showtimeId: id }
  });

  return await prisma.showtime.delete({
    where: { id }
  });
}