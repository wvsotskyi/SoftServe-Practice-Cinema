import { useState, useCallback, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchFilters, { FilterValues } from '../../components/SearchFilters/SearchFilters';
import { MovieCard } from '../../components/MovieCard/MovieCard'; 
import { MovieWithRelations } from '../../types/prisma'; 

export type MovieSearchResult = {
  id: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string; 
};

export function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Partial<FilterValues>>({});
  const [results, setResults] = useState<MovieSearchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchTermSubmit = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handleFiltersUpdate = useCallback((newFilters: FilterValues) => {
    setActiveFilters(newFilters);
  }, []);

  const performSearch = useCallback(async (term: string, filters: Partial<FilterValues>) => {
    const queryIsEmpty = !term.trim();
    const filtersAreEmpty = Object.values(filters).every(val => !val || val === '');

    if (queryIsEmpty && filtersAreEmpty) {
      setResults(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/movies/search`);
      
      if (term.trim()) {
        url.searchParams.append('query', term.trim());
      }

      if (filters.genres) url.searchParams.append('genre_id', filters.genres);
      if (filters.year) url.searchParams.append('year', filters.year);
      if (filters.ageGroup) url.searchParams.append('certification', filters.ageGroup);
      if (filters.minLength) url.searchParams.append('minRuntime', filters.minLength);
      if (filters.maxLength && filters.maxLength !== '999') {
        url.searchParams.append('maxRuntime', filters.maxLength);
      }
      if (filters.language) url.searchParams.append('language', filters.language);

      console.log('Fetching movies with URL:', url.toString());

      const response = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Server error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
      }

      const data: MovieSearchResult[] = await response.json();
      setResults(data.length ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during search.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(searchTerm, activeFilters);
  }, [searchTerm, activeFilters, performSearch]);

  return (
    <div className="min-h-screen p-22">
      <div className="max-w-3xl mx-auto mb-6">
        <SearchBar onSearch={handleSearchTermSubmit} />
      </div>

      <div className="w-full mb-8">
        <SearchFilters
          onFiltersChange={handleFiltersUpdate}
          initialValues={activeFilters}
        />
      </div>

      <div className="max-w-screen-xl mx-auto"> 
        {loading && <p className="text-center text-blue-400 py-8">Loading movies...</p>}
        {error && <p className="text-center text-red-500 p-4 bg-red-900 border border-red-700 rounded my-8">{error}</p>}
        
        {results && !loading && !error && (
          <div>
            {results.length > 0 ? (
              <div>
                <p className="mb-6 text-lg">Found {results.length} film(s):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {results.map(movie => (
                    <MovieCard key={movie.id} movie={movie as unknown as MovieWithRelations} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No films found matching your criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}