import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MovieWithRelations } from "../../types/prisma";
import { Navigate, useLocation } from "react-router-dom";

interface FavoriteButtonProps {
  movie: MovieWithRelations;
  showText?: boolean;
}

export function FavoriteButton({ movie, showText = true }: FavoriteButtonProps) {
  const { tokens, user } = useAuth();
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (location.pathname === "/favorites") {
        setIsFavorite(true);
        return;
      }  
      if (!tokens?.accessToken || !user) return;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/favorites/${movie.id}/check`,
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );
        const data = await res.json();
        setIsFavorite(data.data.isFavorite ?? false);
      } catch (err) {
        console.error("Check favorite failed", err);
      }
    };

    checkFavorite();
  }, [location.pathname]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tokens?.accessToken || !user) {
      setRedirectToLogin(true);
      return;
    }

    try {
      if (isFavorite) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${movie.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
        setIsFavorite(false);
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify({ movieId: movie.id }),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Toggle favorite error", err);
    }
  };

  if (redirectToLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex items-center gap-2">
      {showText && (
        <span className="hidden md:inline text-white text-base font-medium">
          {isFavorite ? "В обраному" : "Додати в обране"}
        </span>
      )}
      <button 
        onClick={toggleFavorite}
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