import prisma from '@utils/db.js';
import { fetchMovieDetails, mapTmdbMovieToPrisma } from '@utils/tmdb.js';

export async function searchMoviesOnTMDB  (query: string)  {
  try {
    const url = new URL(`${process.env.TMDB_BASE_URL}/search/movie`);
    url.searchParams.append('api_key', process.env.TMDB_API_KEY as string);
    url.searchParams.append('query', query);
    url.searchParams.append('include_adult', 'true');
    url.searchParams.append('language', 'uk-UA');
    url.searchParams.append('page', '1');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.results.map((movie: any) => ({
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date
    }));

  } catch (error) {
    console.error('TMDB API Error:', error);
    throw new Error('Failed to search movies on TMDB');
  }
};

export async function addMovieFromTMDB (tmdbId: number) {
  try {
    const tmdbMovie = await fetchMovieDetails(tmdbId);

    // Map TMDB movie to your Prisma schema
    const prismaMovieData = mapTmdbMovieToPrisma(tmdbMovie);

    // Create the movie in your database
    const movie = await prisma.movie.upsert(prismaMovieData);

    return movie;
  } catch (error) {
    console.error('Error adding movie from TMDB:', error);
    throw new Error('Failed to add movie from TMDB');
  } finally {
    await prisma.$disconnect();
  }
};