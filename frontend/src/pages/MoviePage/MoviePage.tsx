import { useEffect, useState } from "react";
import { MovieWithRelations, Cast, Genre } from "../../types/prisma";
import { useParams } from "react-router-dom";
import { FavoriteButton } from "../../components/FavoriteButton/FavoriteButton";
import { ActorCard } from "../../components/ActorCard/ActorCard";
import { MovieRating } from "../../components/MovieRating/MovieRating";
import { MovieTrailer } from "../../components/MovieTrailer/MovieTrailer";

export function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movieData, setMovieData] = useState<MovieWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

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

  const getFullImageUrl = (path: string | null) => {
    return path
      ? `${`${import.meta.env.VITE_TMDB_IMAGE_URL}/w500`}${path}`
      : "";
  };

  const openTrailer = () => {
    setIsTrailerOpen(true);
  };

  const closeTrailer = () => {
    setIsTrailerOpen(false);
  };

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

  return (
    <>
      {isTrailerOpen && movieData.trailerKey && (
        <MovieTrailer movie={movieData} closeTrailer={closeTrailer} />
      )}
      <div
        className="min-h-screen bg-cover bg-center font-mono font-bold text-lg leading-none tracking-normal pt-20"
        style={{
          backgroundImage: `url(${getFullImageUrl(movieData.backdropPath)})`,
        }}
      >
        <div className="backdrop-blur-xs bg-black/70 min-h-screen">
          <div className="mx-[11%] px-4 py-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={getFullImageUrl(movieData.posterPath)}
                alt={movieData.originalTitle}
                className="rounded-t-lg shadow-xl w-full"
              />
              <button
                onClick={openTrailer}
                className="w-full flex items-center justify-center gap-2 bg-[#D5362E] text-white py-3 hover:bg-red-600 transition-colors rounded-b-lg"
                disabled={!movieData.trailerKey}
              >
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL}/svg/play.svg`}
                  alt="Play"
                  className="h-6 w-6 filter brightness-0 invert"
                />
                <span className="font-bold">ДИВИТИСЯ ТРЕЙЛЕР</span>
              </button>
            </div>
            <div className="w-full md:w-2/3 text-white space-y-6">
              <div className="flex items-center justify-between">
                {" "}
                {/* Изменено здесь */}
                <h1 className="font-mono font-bold text-[40px] md:text-[80px] leading-none tracking-normal break-words max-w-[70%]">
                  {movieData.title}
                </h1>
                <FavoriteButton />
              </div>
              <MovieRating voteAverage={movieData.voteAverage || 0} />
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
                  ? `${Math.floor(movieData.runtime / 60)}г.${
                      movieData.runtime % 60
                    }хв.`
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
    </>
  );
}
