import { PrismaClient, MovieStatus, Prisma } from '../generated/prisma/default.js';

const prisma = new PrismaClient();

const LANGUAGE = 'uk'; 
const REGION = 'UA'; 

// Type definitions matching TMDB API responses
interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  runtime: number | null;
  budget: number;
  revenue: number;
  imdb_id: string | null;
  genres: Array<{ id: number; name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }>;
  };
  videos?: {
    results: Array<{
      key: string;
      site: string;
      type: string;
    }>;
  };
  vote_average: number;
  vote_count: number;
  adult: boolean;
  status: 'Released' | 'Upcoming' | 'In Production' | 'Post Production' | 'Planned' | 'Canceled';
}

interface TMDBNowPlayingResponse {
  results: TMDBMovie[];
}

// Helper function for API requests
async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${process.env.TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY as string);
  url.searchParams.set('language', LANGUAGE);
  url.searchParams.set('region', REGION);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
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

// Function to fetch full movie details including credits and videos
async function fetchMovieDetails(movieId: number): Promise<TMDBMovie> {
  try {
    console.log(`Отримання деталей для фільму з ID: ${movieId}...`);
    const data = await tmdbFetch<TMDBMovie>(`/movie/${movieId}`, {
      append_to_response: 'credits,videos'
    });
    console.log(`Деталі для фільму "${data.title}" успішно отримані.`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні деталей фільму ${movieId}:`, error instanceof Error ? error.message : error);
    throw error;
  }
}

// Function to map TMDB status to Prisma enum
function mapStatus(status: TMDBMovie['status']): MovieStatus | null {
  switch (status) {
    case 'Released': return MovieStatus.RELEASED;
    case 'Upcoming': return MovieStatus.UPCOMING;
    case 'In Production':
    case 'Post Production': return MovieStatus.IN_PRODUCTION;
    default: return null;
  }
}

// Function to map TMDB movie to Prisma create/update input
function mapTmdbMovieToPrisma(tmdbMovie: TMDBMovie): Prisma.MovieUpsertArgs {
  // Find trailer key (YouTube)
  const trailer = tmdbMovie.videos?.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  // Map production countries to string array
  const productionCountries = tmdbMovie.production_countries.map(
    (country) => country.iso_3166_1
  );

  // Convert IMDB ID to number (remove 'tt' prefix)
  const imdbId = tmdbMovie.imdb_id ? parseInt(tmdbMovie.imdb_id.replace('tt', '')) : 0;

  return {
    where: { tmdbId: tmdbMovie.id },
    create: {
      tmdbId: tmdbMovie.id,
      imdbId,
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      originalLanguage: tmdbMovie.original_language,
      overview: tmdbMovie.overview,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
      production_countries: productionCountries,
      runtime: tmdbMovie.runtime,
      budget: tmdbMovie.budget,
      revenue: tmdbMovie.revenue,
      trailerKey: trailer?.key,
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      adult: tmdbMovie.adult,
      status: mapStatus(tmdbMovie.status),
      genres: {
        connectOrCreate: tmdbMovie.genres.map((genre) => ({
          where: { id: genre.id },
          create: { id: genre.id, name: genre.name },
        })),
      },
      cast: {
        create: tmdbMovie.credits?.cast
          .filter((actor) => actor.order < 10) // Limit to top 10 cast members
          .map((actor) => ({
            tmdbId: actor.id,
            name: actor.name,
            character: actor.character,
            profilePath: actor.profile_path,
            order: actor.order,
          })) || [],
      },
    },
    update: {
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      overview: tmdbMovie.overview,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
      production_countries: productionCountries,
      runtime: tmdbMovie.runtime,
      budget: tmdbMovie.budget,
      revenue: tmdbMovie.revenue,
      trailerKey: trailer?.key,
      voteAverage: tmdbMovie.vote_average,
      voteCount: tmdbMovie.vote_count,
      adult: tmdbMovie.adult,
      status: mapStatus(tmdbMovie.status),
      genres: {
        connectOrCreate: tmdbMovie.genres.map((genre) => ({
          where: { id: genre.id },
          create: { id: genre.id, name: genre.name },
        })),
      },
      cast: {
        deleteMany: {}, // Remove existing cast to avoid duplicates
        create: tmdbMovie.credits?.cast
          .filter((actor) => actor.order < 10)
          .map((actor) => ({
            tmdbId: actor.id,
            name: actor.name,
            character: actor.character,
            profilePath: actor.profile_path,
            order: actor.order,
          })) || [],
      },
    },
  };
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