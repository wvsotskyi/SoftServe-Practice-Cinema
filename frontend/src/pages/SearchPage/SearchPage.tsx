import { useEffect, useState, useCallback } from 'react';
import { MovieCard } from '../../components/MovieCard/MovieCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchFilters from '../../components/SearchFilters/SearchFilters'; 
import { FilterValues }  from '../../components/SearchFilters/SearchFilters';
import { MovieWithRelations } from '../../types/prisma';
import { debounce } from 'lodash';

export function SearchPage() {
  const [movies, setMovies] = useState<MovieWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Partial<FilterValues>>({});

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams();

    if (searchTerm) {
      queryParams.append('query', searchTerm);
    }
    if (activeFilters.genres) {
      queryParams.append('genres', activeFilters.genres);
    }
    if (activeFilters.year) {
      queryParams.append('year', activeFilters.year);
    }
    if (activeFilters.ageGroup) {
      queryParams.append('ageGroup', activeFilters.ageGroup);
    }
    if (activeFilters.minLength) {
      queryParams.append('minLength', activeFilters.minLength);
    }
    if (activeFilters.maxLength) {
      queryParams.append('maxLength', activeFilters.maxLength);
    }
    if (activeFilters.language) {
      queryParams.append('language', activeFilters.language);
    }

    const queryString = queryParams.toString();
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/movies/search${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch movies. Status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data.data.movies); 
    } catch (err) {
      setError((err as Error).message);
      setMovies([]); 
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeFilters]); 

  const debouncedFetchMovies = useCallback(
    () => debounce(fetchMovies, 500), 
    [fetchMovies]
  );

  useEffect(() => {
    const debounced = debouncedFetchMovies();
    debounced();
    return () => debounced.cancel();
  }, [debouncedFetchMovies, searchTerm, activeFilters]);

  const handleSearch = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterValues) => {
    setActiveFilters(newFilters);
  }, []);

  return (
    <div className="relative min-h-screen px-0 py-20">
      <div className="fixed z-50 w-full transition-all duration-300 ease-in-out bg-[#131215]">
        <div className="w-full max-w-d px-4 sm:px-25 mb-6 pt-5">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        </div>

        <div className="px-4 sm:px-25 transition-all duration-300 ease-in-out">
          <SearchFilters onFiltersChange={handleFiltersChange} initialValues={activeFilters} />
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