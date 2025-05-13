import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ShowtimeFilterInput {
  genreId?: number;
  dates?: string[];
  times?: string[];
}

export async function getShowtimeFilterOptions() {
  const genres = await prisma.genre.findMany({
    where: {
      movies: {
        some: {
          showtimes: {
            some: {},
          },
        },
      },
    },
    distinct: ['id'],
    orderBy: { name: 'asc' },
  });

  const dateResults = await prisma.showtime.findMany({
    select: { date: true },
    distinct: ['date'],
    orderBy: { date: 'asc' },
  });

  const dates = [...new Set(dateResults.map(s => s.date.toISOString().split('T')[0]))];

  const timeResults = await prisma.showtime.findMany({
    select: { timeOfDaySeconds: true },
    distinct: ['timeOfDaySeconds'],
    orderBy: { timeOfDaySeconds: 'asc' },
  });

  const times = [...new Set(timeResults.map(s => convertSecondsToTime(s.timeOfDaySeconds)))];

  return { genres, dates, times };
}

export async function getShowtimesWithFilters({
  genreId,
  dates,
  times,
}: ShowtimeFilterInput) {
  const whereClause: any = {};

  if (dates?.length) {
    whereClause.date = {
      in: dates.map((d) => new Date(d)),
    };
  }

  if (times?.length) {
    const secondsList = times.map((t) => {
      const [hh, mm] = t.split(':').map(Number);
      return hh * 3600 + mm * 60;
    });

    whereClause.timeOfDaySeconds = {
      in: secondsList,
    };
  }

  if (genreId !== undefined) {
    whereClause.movie = {
      genres: {
        some: { id: genreId },
      },
    };
  }

  const showtimes = await prisma.showtime.findMany({
    where: whereClause,
    include: {
      movie: true,
      hall: true,
    },
    orderBy: {
      movieId: 'asc',
    },
  });

  const grouped: Record<number, { movie: any; showtimes: any[] }> = {};

  for (const s of showtimes) {
    if (!grouped[s.movieId]) {
      grouped[s.movieId] = {
        movie: s.movie,
        showtimes: [],
      };
    }
    grouped[s.movieId].showtimes.push({
      id: s.id,
      hall: s.hall,
      date: s.date,
      time: convertSecondsToTime(s.timeOfDaySeconds),
      price: s.price,
    });
  }

  return Object.values(grouped);
}

export async function createShowtime(data: {
  movieId: number;
  hallId: number;
  date: string;
  time: string;
  price: number;
}) {
  const [hh, mm] = data.time.split(':').map(Number);
  const timeOfDaySeconds = hh * 3600 + mm * 60;

  const dateOnly = new Date(data.date)

  const showtime = await prisma.showtime.create({
    data: {
      movieId: data.movieId,
      hallId: data.hallId,
      date: dateOnly,
      timeOfDaySeconds,
      price: data.price,
    },
  });

  return {
    ...showtime,
    time: data.time,
  };
}

export async function updateShowtime(id: number, data: {
  movieId?: number;
  hallId?: number;
  date?: string;
  time?: string;
  price?: number;
}) {
  const updateData: any = {};

  if (data.movieId !== undefined) updateData.movieId = data.movieId;
  if (data.hallId !== undefined) updateData.hallId = data.hallId;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.time !== undefined) {
    const [hh, mm] = data.time.split(':').map(Number);
    updateData.timeOfDaySeconds = hh * 3600 + mm * 60;
  }
  if (data.price !== undefined) updateData.price = data.price;

  const showtime = await prisma.showtime.update({
    where: { id },
    data: updateData,
  });

  return {
    ...showtime,
    time: data.time ?? convertSecondsToTime(showtime.timeOfDaySeconds),
  };
}

export async function deleteShowtime(id: number) {
  await prisma.showtime.delete({
    where: { id },
  });
}

export async function getShowtime(id: number) {
  const result = await prisma.showtime.findUnique({
    where: { id },
  });

  if (result?.timeOfDaySeconds == null)
    throw new Error("Time is not provided in database")

  return {
    time: convertSecondsToTime(result?.timeOfDaySeconds),
    date: result.date,
    hallId: result.hallId,
    movieId: result.movieId,
    price: result.price
  }
}

function convertSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${paddedHours}:${paddedMinutes}`;
}