import { useEffect, useState } from 'react';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import { MovieWithRelations } from '../../types/prisma';

export function SearchPage() {
  const [movies, setMovies] = useState<MovieWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/search`);
        if (!response.ok) {
          throw new Error(`Failed to fetch movies. Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data.data.movies);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [])

  return (
    <div className="min-h-screen px-0 py-25 sm:py-28">
      <div className="w-full max-w-d mx-auto px-4 mb-6">
        <SearchBar />
      </div>

      <div className="w-full mb-12 sm:px-25 transition-all duration-300 ease-in-out">
        <SearchFilters />
      </div>

      <div className="relative mx-auto w-[90%]">
        <div className="grid justify-items-center grid-cols-[repeat(auto-fit,minmax(155px,1fr))] gap-8 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {loading && <p className="text-center col-span-full">Loading...</p>}
          {error && <p className="text-red-500 text-center col-span-full">{error}</p>}

          {!loading && !error && movies.length === 0 && (
            <p className="text-center col-span-full">No movies found</p>
          )}

          {!loading && !error && movies.map((movie) => (
            <div key={movie.id} className="animate-fade-in">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}