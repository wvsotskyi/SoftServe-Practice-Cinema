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
  trailerUrl: string;
  voteAverage: number;
  voteCount: number;
  adult: boolean;
  status: string;
  genres: number[];
}

export function EditMovie() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("id");

  useEffect(() => {
    if (!movieId) return;

    const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;
    if (!accessToken) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/movies/${movieId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setMovie(data.data);
          setSelectedGenreId(data.data.genres?.[0]?.id || null);
        } else {
          console.error("Ошибка при получении данных фильма:", data);
        }
      })
      .catch((err) => {
        console.error("Ошибка при подключении:", err);
        alert("Ошибка подключения при получении данных фильма");
      });

    // Запрос для получения жанров
    fetch(`${import.meta.env.VITE_API_URL}/api/genres`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setGenres(data.data);
        } else {
          console.error("Ошибка при получении жанров:", data);
        }
      })
      .catch((err) => {
        console.error("Ошибка при подключении:", err);
        alert("Ошибка подключения при получении жанров");
      });
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movie || !movieId) return;

    const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;
    if (!accessToken) {
      alert("Немає токена авторизації.");
      return;
    }

    const updatedMovie = {
      title: movie.title,
      originalTitle: movie.title, 
      originalLanguage: movie.originalLanguage,
      overview: movie.overview,
      posterPath: movie.posterPath,
      backdropPath: movie.backdropPath || "",
      releaseDate: movie.releaseDate,
      runtime: movie.runtime,
      budget: movie.budget || 0,
      revenue: movie.revenue || 0,
      trailerKey: movie.trailerUrl, 
      voteAverage: movie.voteAverage || 0,
      voteCount: movie.voteCount || 0,
      adult: movie.adult,
      status: "RELEASED", 
      genres: selectedGenreId ? [selectedGenreId] : [],
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
        navigate("/admin");
      } else {
        const error = await res.json();
        console.error("Ошибка на сервере:", error);
        alert("Не вдалося оновити фільм");
      }
    } catch (err) {
      console.error("Ошибка при подключении:", err);
      alert("Ошибка подключения при обновлении фильма");
    }
  };

  if (!movie) return <p className="text-white p-4">Завантаження...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white p-6 max-w-5xl mx-auto bg-[#1C1B20] rounded-lg border border-[#3F3D45]">
      <h2 className="text-2xl font-bold mb-4">Редагувати фільм</h2>

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
          <label className="block mb-1">Опис сюжету фільму:</label>
          <textarea
            value={movie.overview}
            onChange={(e) => setMovie({ ...movie, overview: e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block mb-1 text-gray-300">Жанр</label>
          <div className="relative">
            <select
              name="genre"
              value={selectedGenreId || ""}
              onChange={(e) => setSelectedGenreId(+e.target.value)}
              className="w-full appearance-none p-3 pr-10 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
            >
              <option value="">Оберіть жанр</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1">Трейлер (YouTube URL):</label>
          <input
            type="text"
            value={movie.trailerUrl}
            onChange={(e) => setMovie({ ...movie, trailerUrl: e.target.value })}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45]"
          />
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
