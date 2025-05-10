import React, { useState, useEffect, useCallback, useRef } from 'react';

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
type DurationKey = keyof typeof durationOptions;


interface SelectOption {
  key?: string | number;
  value: string | number;
  label: string;
}

const FilterSelect: React.FC<{
  name: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder: string;
  className: string;
  id?: string;
}> = ({ name, value, onChange, options, placeholder, className, id }) => (
  <select
    id={id || name}
    name={name}
    value={value}
    onChange={onChange}
    className={className}
  >
    <option value="">{placeholder}</option>
    {options.map(option => (
      <option key={option.key || option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);


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

  const [isAdditionalFiltersOpen, setIsAdditionalFiltersOpen] = useState(false);
  const additionalFiltersTriggerRef = useRef<HTMLButtonElement>(null);
  const additionalFiltersDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/genres`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGenres(data.data); 
      } catch (error) {
        console.error('Помилка завантаження жанрів:', error);
        setGenres([]); 
      }
    };
    fetchGenres();
  }, []);

  const handleSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'duration') {
      if (value && durationOptions[value as DurationKey]) {
        const { min, max } = durationOptions[value as DurationKey];
        setSelectedFilters(prev => ({
          ...prev,
          minLength: min?.toString() || '',
          maxLength: max?.toString() || '',
        }));
      } else {
        setSelectedFilters(prev => ({
          ...prev,
          minLength: '',
          maxLength: '',
        }));
      }
    } else {
      setSelectedFilters(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  useEffect(() => {
    onFiltersChange?.(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        additionalFiltersTriggerRef.current && !additionalFiltersTriggerRef.current.contains(event.target as Node) &&
        additionalFiltersDropdownRef.current && !additionalFiltersDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAdditionalFiltersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleAdditionalFilters = () => {
    setIsAdditionalFiltersOpen(!isAdditionalFiltersOpen);
  };

  const selectClasses = "w-full h-full bg-[#131215] border border-[#6F6C6C] text-gray-200 text-sm rounded-md p-2.5 duration-150 ease-in-out cursor-pointer text-center appearance-none bg-[url('/svg/chevron-down.svg')] bg-no-repeat bg-[length:20px_20px] bg-[center_right_1rem] pr-12 focus:outline-none focus:ring-1 focus:ring-[#6F6C6C]";

  let currentDurationSelectedValue = '';
  if (selectedFilters.minLength || selectedFilters.maxLength) {
    const min = selectedFilters.minLength ? parseInt(selectedFilters.minLength, 10) : -1;
    const max = selectedFilters.maxLength ? parseInt(selectedFilters.maxLength, 10) : -1;
    for (const key in durationOptions) {
      const option = durationOptions[key as DurationKey];
      if (option.min === min && option.max === max) {
        currentDurationSelectedValue = key;
        break;
      }
    }
  }

  const filterConfigs = [
    {
      name: "genres",
      placeholder: GENRE_PLACEHOLDER,
      options: genres.map(genre => ({ key: genre.id, value: String(genre.id), label: genre.name })),
      value: selectedFilters.genres,
      minWidthClasses: "sm:min-w-[130px] md:min-w-[140px] lg:min-w-[160px]",
      mobileBehavior: 'visible',
    },
    {
      name: "year",
      placeholder: YEAR_PLACEHOLDER,
      options: Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i).map(year => ({ key: year, value: String(year), label: String(year) })),
      value: selectedFilters.year,
      minWidthClasses: "sm:min-w-[110px] md:min-w-[120px] lg:min-w-[140px]",
      mobileBehavior: 'inDropdown',
    },
    {
      name: "ageGroup",
      placeholder: AGE_GROUP_PLACEHOLDER,
      options: [
        { value: "G", label: "0+" }, { value: "PG", label: "6+" },
        { value: "PG-13", label: "12+" }, { value: "R", label: "16+" },
        { value: "NC-17", label: "18+" }
      ].map(opt => ({ ...opt, key: opt.value })),
      value: selectedFilters.ageGroup,
      minWidthClasses: "sm:min-w-[140px] md:min-w-[150px] lg:min-w-[170px]",
      mobileBehavior: 'inDropdown',
    },
    {
      name: "duration",
      placeholder: DURATION_PLACEHOLDER,
      options: Object.keys(durationOptions).map(key => ({ key, value: key, label: key })),
      value: currentDurationSelectedValue, 
      minWidthClasses: "sm:min-w-[130px] md:min-w-[140px] lg:min-w-[160px]",
      mobileBehavior: 'inDropdown',
    },
    {
      name: "language",
      placeholder: LANGUAGE_PLACEHOLDER,
      options: [
        { value: "en", label: "English" }, { value: "ua", label: "Українська" },
        { value: "es", label: "Español" }, { value: "fr", label: "Français" },
        { value: "de", label: "Deutsch" }
      ].map(opt => ({ ...opt, key: opt.value })),
      value: selectedFilters.language,
      minWidthClasses: "sm:min-w-[130px] md:min-w-[140px] lg:min-w-[160px]",
      mobileBehavior: 'inDropdown',
    }
  ];

  const firstVisibleFilter = filterConfigs.find(f => f.mobileBehavior === 'visible');
  const additionalDropdownFilters = filterConfigs.filter(f => f.mobileBehavior === 'inDropdown');

  return (
    <div className="relative bg-[#1C1B20] p-4 sm:p-6 border border-[#6F6C6C] shadow-lg w-full">
      <div className="flex flex-row flex-wrap items-stretch w-full gap-3 sm:gap-x-3 md:gap-x-4 lg:gap-x-6">

        {firstVisibleFilter && (
          <div className={`flex-auto basis-[calc(40%-0.375rem)] sm:flex-1 sm:basis-auto ${firstVisibleFilter.minWidthClasses}`}>
            <FilterSelect
              name={firstVisibleFilter.name}
              value={firstVisibleFilter.value}
              onChange={handleSelectChange}
              options={firstVisibleFilter.options}
              placeholder={firstVisibleFilter.placeholder}
              className={selectClasses}
            />
          </div>
        )}

        <div className="relative flex-auto basis-[calc(60%-0.375rem)] sm:hidden">
          <button
            ref={additionalFiltersTriggerRef}
            type="button"
            onClick={toggleAdditionalFilters}
            className="w-full h-full bg-[#131215] border border-[#6F6C6C] text-gray-200 text-sm rounded-md p-2.5 duration-150 ease-in-out cursor-pointer flex items-center justify-center flex-row-reverse gap-4 focus:outline-none focus:ring-1 focus:ring-[#6F6C6C]"
          >
            <img src="/svg/filters.svg" alt="" className="w-5 h-5 shrink-0"/>
            <span className="truncate">Додаткові Фільтри</span>
          </button>
        </div>

        {additionalDropdownFilters.map(filter => (
          <div key={filter.name} className={`hidden sm:block sm:flex-1 sm:basis-auto ${filter.minWidthClasses}`}>
            <FilterSelect
              name={filter.name}
              value={filter.value}
              onChange={handleSelectChange}
              options={filter.options}
              placeholder={filter.placeholder}
              className={selectClasses}
            />
          </div>
        ))}
      </div>

      {isAdditionalFiltersOpen && (
        <div
          id="additional-filters-dropdown"
          ref={additionalFiltersDropdownRef}
          className="absolute sm:hidden z-20 top-full left-4 right-4 mt-2 origin-top bg-[#1C1B20] border border-[#6F6C6C] rounded-md shadow-xl p-4 space-y-4"
        >
          {additionalDropdownFilters.map(filter => (
            <div key={`dropdown-${filter.name}`}>
              <FilterSelect
                id={`dropdown-${filter.name}`}
                name={filter.name}
                value={filter.value}
                onChange={(e) => {
                  handleSelectChange(e);
                }}
                options={filter.options}
                placeholder={filter.placeholder}
                className={selectClasses}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;