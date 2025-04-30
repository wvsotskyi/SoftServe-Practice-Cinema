import { useState } from 'react';

const FavoriteButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex items-center gap-2 ml-auto">
      <span className="text-white text-base font-medium">Додати в обране</span>
      <button 
        onClick={() => setIsFavorite(!isFavorite)}
        className="p-1 border-2 border-red-500 rounded-lg text-red-500"
      >
        <svg
          className={`w-7 h-7 ${isFavorite ? 'fill-red-500' : 'fill-none'} stroke-red-500`}
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      </button>
    </div>
  );
};

export default FavoriteButton;
