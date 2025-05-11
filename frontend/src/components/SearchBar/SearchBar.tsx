import React from 'react';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = React.useState<string>(initialValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm); 
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    console.log('Search submitted:', searchTerm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-xl mx-auto bg-gray-700 rounded-md shadow-md h-10 border-1 border-[#6F6C6C]"
    >
      <div className="p-2 bg-[#D5362E] rounded-l-md flex items-center justify-center h-full border-r-1 border-[#6F6C6C]">
        <img 
          src="svg/search.svg" 
          alt="Search"
          className='w-5 h-5 text-white'
        />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Пошук..."
        className="w-full px-3 py-2 text-sm text-white bg-[#1C1B20] focus:outline-none rounded-r-md placeholder-[#FFFFFF] h-full"
        aria-label="Пошук фільмів"
      />
    </form>
  );
};

export default SearchBar;