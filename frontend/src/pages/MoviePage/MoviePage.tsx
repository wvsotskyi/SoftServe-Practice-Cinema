import { useEffect, useState } from "react";
import { MovieWithRelations, Cast, Genre } from "../../types/prisma";
import { useParams } from "react-router-dom";
import {FavoriteButton} from "../../components/FavoriteButton/FavoriteButton";
import {ActorCard} from "../../components/ActorCard/ActorCard";
import triangle from "../../assets/images/triangle.png";
import { MovieRating } from "../../components/MovieRating/MovieRating";

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<MovieWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((apiResponse) => {
        if (apiResponse.success && apiResponse.data) {
          setMovieData(apiResponse.data);
        } else {
          throw new Error(apiResponse.message || "Failed to load movie data");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading movie data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="text-white text-center py-8 pt-16">Завантаження...</div>
    );
  }

  if (error) {
    return (
      <div className="text-white text-center py-8 pt-16">Помилка: {error}</div>
    );
  }

  if (!movieData) {
    return (
      <div className="text-white text-center py-8 pt-16">Фільм не знайдено</div>
    );
  }

  const getFullImageUrl = (path: string | null) => {
    return path
      ? `${`${import.meta.env.VITE_TMDB_IMAGE_URL}/w500`}${path}`
      : "";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center font-mono font-bold text-lg leading-none tracking-normal pt-14"
      style={{
        backgroundImage: `url(${getFullImageUrl(movieData.backdropPath)})`,
      }}
    >
      <div className="backdrop-blur-xs bg-black/70 min-h-screen">
        <div className="mx-[11%] px-4 py-8 flex flex-col md:flex-row gap-8">
          {/* Постер і кнопка трейлера */}
          <div className="w-full md:w-1/3">
            <img
              src={getFullImageUrl(movieData.posterPath)}
              alt={movieData.originalTitle}
              className="rounded-t-lg shadow-xl w-full"
            />
            <button className="w-full bg-red-600 text-white py-3 hover:bg-red-700 transition flex items-center justify-center gap-2 rounded-none font-mono font-bold text-[18px] leading-[100%] tracking-[0.1em]">
              <img src={triangle} alt="Play" className="h-5 w-5" />
              <span>ДИВИТИСЯ ТРЕЙЛЕР</span>
            </button>
          </div>

          {/* Інформація про фільм */}
          <div className="w-full md:w-2/3 text-white space-y-6">
            {/* Заголовок і обране */}
            <div className="flex items-center">
              <h1 className="font-mono font-bold text-[80px] leading-none tracking-normal text-4xl font-bold">
                {movieData.title}
              </h1>
              <div className="flex-1" />
              <FavoriteButton />
            </div>

            <MovieRating voteAverage={movieData.voteAverage || 0} />

            {/* Жанри */}
            <div className="flex flex-wrap gap-2 mt-4">
              {movieData.genres.map((genre: Genre) => (
                <div
                  key={genre.id}
                  className="border border-white text-white px-5 py-2 rounded-full text-[18px] font-normal"
                  style={{ borderWidth: "1.5px" }}
                >
                  {genre.name}
                </div>
              ))}
            </div>

            <p>
              <span className="text-[#D5362E]">Рік:</span>{" "}
              {movieData.releaseDate
                ? new Date(movieData.releaseDate).getFullYear()
                : "Невідомо"}
            </p>

            <p>
              <span className="text-[#D5362E]">Тривалість:</span>{" "}
              {movieData.runtime
                ? `${Math.floor(movieData.runtime / 60)} год ${
                  movieData.runtime % 60
                } хв`
                : "Невідомо"}
            </p>

            <p>
              <span className="text-[#D5362E]">Вікові обмеження:</span>{" "}
              {movieData.adult ? "18+" : "Для всіх"}
            </p>
            <p>
              <span className="text-[#D5362E]">Статус:</span>{" "}
              {movieData.status === "RELEASED"
                ? "Випущено"
                : movieData.status === "UPCOMING"
                  ? "Очікується"
                  : "В прокаті"}
            </p>

            <p className="text-lg">{movieData.overview}</p>

            <div>
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-[#D5362E]">Акторський склад:</span>
              </h2>
              <div className="flex flex-wrap gap-4">
                {movieData.cast.map((actor: Cast) => (
                  <ActorCard key={actor.id} actor={actor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};