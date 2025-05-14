import { useEffect, useState } from "react";
import { MovieCard } from "../../components/MovieCard/MovieCard";
import { MovieWithRelations } from "../../types/prisma";
import { useAuth } from "../../context/AuthContext";
import css from "./FavoritesPage.module.css";

export function FavoritesPage() {
  const { tokens, user } = useAuth();
  const [favorites, setFavorites] = useState<MovieWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!tokens?.accessToken || !user) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        const data = await res.json();
        const movies = data.data.map((fav: any) => fav.movie);
        setFavorites(movies);
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (isLoading) {
    return <p className="text-white text-center mt-20">Завантаження...</p>;
  }

  return favorites.length > 0 ? (
    <div className={css["favorites-page"]}>
      <div className={css["favorites-grid-container"]}>
        <p className={css["favorites-title"]}>Обране</p>
        <div className={css["favorites-grid"]}>
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className={css["favorites-page-empty"]}>
      <h2>Не знайдено</h2>
      <p>Схоже, ви ще не додали жодного улюбленого фільму</p>
    </div>
  );
}
