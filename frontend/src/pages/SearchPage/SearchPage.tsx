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
    <div className="relative min-h-screen px-0 py-20">

      <div className="fixed z-50 w-full transition-all duration-300 ease-in-out bg-[#131215]">
        <div className="w-full max-w-d px-4 sm:px-25 mb-6 pt-5">
          <SearchBar />
        </div>

        <div className="px-4 sm:px-25 transition-all duration-300 ease-in-out">
          <SearchFilters />
        </div>
      </div>

      <div className="relative pt-51 sm:pt-89 md:pt-67 xl:pt-51 mx-auto w-[90%]">
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