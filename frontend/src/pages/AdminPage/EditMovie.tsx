import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  title: string;
  originalTitle: string;
  originalLanguage: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  runtime: number;
  budget: number;
  revenue: number;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
  status: string;
  genres: number[];
}

export default function EditMovie() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("id");

  useEffect(() => {
    if (!movieId) return;
    const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;
    if (!accessToken) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movieId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMovie(data.data);
          const genreIds = data.data.genres.map((g: Genre) => g.id);
          setSelectedGenres(genreIds);
        }
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/genres`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setGenres(data.data);
        }
      });
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie || !movieId) return;

    const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;
    if (!accessToken) return;

    const updatedMovie = {
      ...movie,
      genres: selectedGenres,
      status: "RELEASED",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedMovie),
      });

      if (res.ok) {
        setSuccessMessage("Фільм успішно оновлено!");
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        alert("Не вдалося оновити фільм");
      }
    } catch {
      alert("Помилка з'єднання");
    }
  };

  if (!movie) return <p className="text-white p-4">Завантаження...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-white p-6 mt-24 max-w-5xl mx-auto bg-[#1C1B20] rounded-lg border border-[#3F3D45]"
    >
      <h2 className="text-2xl font-bold mb-4">Редагувати фільм</h2>

      {successMessage && (
        <div className="text-green-400 text-center font-semibold mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">Назва:</label>
          <input
            type="text"
            value={movie.title}
            onChange={(e) => setMovie({ ...movie, title: e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
        </div>
        <div>
          <label className="block mb-1">Тривалість:</label>
          <input
            type="number"
            value={movie.runtime}
            onChange={(e) => setMovie({ ...movie, runtime: +e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
        </div>
        <div>
          <label className="block mb-1">Мова фільму:</label>
          <input
            type="text"
            value={movie.originalLanguage}
            onChange={(e) => setMovie({ ...movie, originalLanguage: e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
        </div>
        <div>
          <label className="block mb-1">Рік випуску:</label>
          <input
            type="text"
            value={new Date(movie.releaseDate).getFullYear()}
            onChange={(e) => setMovie({ ...movie, releaseDate: `${e.target.value}-01-01` })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1">Постер:</label>
          <img
            src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w500${movie.posterPath}`}
            alt={movie.title}
            className="w-48 h-auto mb-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Опис:</label>
          <textarea
            value={movie.overview}
            onChange={(e) => setMovie({ ...movie, overview: e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-300 font-medium">Жанри:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {genres.map((genre) => (
            <label key={genre.id} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={() => {
                  setSelectedGenres((prev) =>
                    prev.includes(genre.id)
                      ? prev.filter((id) => id !== genre.id)
                      : [...prev, genre.id]
                  );
                }}
                className="form-checkbox h-4 w-4 text-[#FF4D4D] focus:ring-[#FF4D4D] rounded"
              />
              <span>{genre.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#FF4D4D] hover:bg-[#ff6666] text-white py-3 rounded mt-6 font-semibold"
      >
        Оновити
      </button>
    </form>
  );
}
