import { PrismaClient } from '@prisma/client';
import { fetchMovieDetails, mapTmdbMovieToPrisma, tmdbFetch, TMDBMovie } from '@utils/tmdb.js';

const prisma = new PrismaClient();

interface TMDBNowPlayingResponse {
  results: TMDBMovie[];
}

// Function to fetch now-playing movies from TMDB
async function fetchNowPlayingMovies(): Promise<TMDBMovie[]> {
  try {
    console.log('Отримання списку фільмів, які зараз у кіно...');
    const data = await tmdbFetch<TMDBNowPlayingResponse>('/movie/now_playing');
    console.log(`Успішно отримано ${data.results.length} фільмів.`);
    return data.results;
  } catch (error) {
    console.error('Помилка при отриманні фільмів:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Main function to fetch and save now-playing movies
export async function fillDatabaseWithMovies() {
  try {
    console.log('Початок синхронізації фільмів...');

    // Fetch now-playing movies
    const nowPlayingMovies = await fetchNowPlayingMovies();

    // Process each movie
    for (const movie of nowPlayingMovies) {
      try {
        // Fetch full details for each movie
        const movieDetails = await fetchMovieDetails(movie.id);

        // Map to Prisma schema
        const prismaMovieData = mapTmdbMovieToPrisma(movieDetails);

        // Upsert movie in database
        await prisma.movie.upsert(prismaMovieData);

        console.log(`Фільм "${movieDetails.title}" успішно оновлено/додано.`);
      } catch (error) {
        console.error(`Помилка при обробці фільму ${movie.id}:`, error instanceof Error ? error.message : error);
      }
    }

    console.log('Синхронізація фільмів завершена.');
  } catch (error) {
    console.error('Критична помилка під час синхронізації:', error instanceof Error ? error.message : error);
  } finally {
    await prisma.$disconnect();
  }
}

fillDatabaseWithMovies()