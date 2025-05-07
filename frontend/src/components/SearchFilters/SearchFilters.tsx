import React, { useState, useEffect, useCallback } from 'react';

interface Genre {
    id: number;
    name: string;
}

interface FilterValues {
  genres: string; 
  year: string;
  ageGroup: string;
  minLength: string;
  maxLength: string;
  language: string;
}

interface FiltersProps {
  onFiltersChange?: (filters: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
}

const GENRE_PLACEHOLDER = "Обрати жанр";
const YEAR_PLACEHOLDER = "Обрати рік";
const AGE_GROUP_PLACEHOLDER = "Обрати вік перегляду";
const DURATION_PLACEHOLDER = "Обрати тривалість";
const LANGUAGE_PLACEHOLDER = "Обрати мову фільму";

const durationOptions = {
  "< 1 hour": { min: 0, max: 60 },
  "1 - 1.5 hours": { min: 60, max: 90 },
  "1.5 - 2 hours": { min: 90, max: 120 },
  "2 - 2.5 hours": { min: 120, max: 150 },
  "> 2.5 hours": { min: 150, max: 999 }
} as const;

const Filters: React.FC<FiltersProps> = ({ onFiltersChange, initialValues }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    genres: initialValues?.genres || '',
    year: initialValues?.year || '',
    ageGroup: initialValues?.ageGroup || '',
    minLength: initialValues?.minLength || '',
    maxLength: initialValues?.maxLength || '',
    language: initialValues?.language || '',
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('${import.meta.env.VITE_API_URL}/api/genres');
        if (!response.ok) {
          throw new Error('HTTP error! Status: ${response.status}');
        }
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Помилка завантаження жанрів:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === 'duration') {
        type DurationKey = keyof typeof durationOptions;
        if (value && durationOptions[value as DurationKey]) {
          const { min, max } = durationOptions[value as DurationKey];
          setSelectedFilters(prev => ({
            ...prev,
            minLength: min?.toString() || '',
            maxLength: max?.toString() || ''
          }));
        } else {
          setSelectedFilters(prev => ({
            ...prev,
            minLength: '',
            maxLength: ''
          }));
        }
        return; 
    }
    setSelectedFilters(prev => ({ ...prev, [name]: value }));
  }, [])

  useEffect(() => {
    onFiltersChange?.(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  const selectClasses = "w-full bg-[#131215] border-1 border-[#6F6C6C] text-gray-200 text-sm rounded-md p-2.5 duration-150 ease-in-out cursor-pointer text-center appearance-none bg-[url('/svg/chevron-down.svg')] bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem] pr-12";

  return (
    <div className="bg-[#1C1B20] p-4 sm:p-6 border-1 border-[#6F6C6C] shadow-lg w-full">
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center w-full gap-4 sm:gap-x-3 md:gap-x-4 lg:gap-x-6">
        <div className="flex-1 w-full sm:min-w-[130px] md:min-w-[140px] lg:min-w-[160px]">
          <select
            name="genres"
            value={selectedFilters.genres}
            onChange={handleSelectChange}
            className={selectClasses}
          >
            <option value="">{GENRE_PLACEHOLDER}</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full sm:min-w-[110px] md:min-w-[120px] lg:min-w-[140px]">
          <select
            name="year"
            value={selectedFilters.year}
            onChange={handleSelectChange}
            className={selectClasses}
          >
            <option value="">{YEAR_PLACEHOLDER}</option>
            {Array.from({length: 35}, (_, i) => new Date().getFullYear() - i)
              .map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
          </select>
        </div>

        <div className="flex-1 w-full sm:min-w-[140px] md:min-w-[150px] lg:min-w-[170px]">
          <select
            name="ageGroup"
            value={selectedFilters.ageGroup}
            onChange={handleSelectChange}
            className={selectClasses}
          >
            <option value="">{AGE_GROUP_PLACEHOLDER}</option>
            <option value="G">0+</option>
            <option value="PG">6+</option>
            <option value="PG-13">12+</option>
            <option value="R">16+</option>
            <option value="NC-17">18+</option>
          </select>
        </div>

        <div className="flex-1 w-full sm:min-w-[130px] md:min-w-[140px] lg:min-w-[160px]">
          <select
            name="duration"
            onChange={handleSelectChange}
            className={selectClasses}
          >
            <option value="">{DURATION_PLACEHOLDER}</option>
            {Object.keys(durationOptions).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full sm:min-w-[130px] md:min-w-[140px] lg:min-w-[160px]">
          <select
            name="language"
            value={selectedFilters.language}
            onChange={handleSelectChange}
            className={selectClasses}
          >
            <option value="">{LANGUAGE_PLACEHOLDER}</option>
            <option value="en">English</option>
            <option value="ua">Українська</option>
            <option value="es">Español</option>
            <option value="fr">Français</option> 
            <option value="de">Deutsch</option> 
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
