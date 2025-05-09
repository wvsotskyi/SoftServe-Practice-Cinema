import { useEffect, useState } from "react";
import { FaFilm, FaThList } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  genres: Genre[];
  originalLanguage: string;
  overview: string;
  releaseDate: Date;
  runtime: number;
  posterPath: string;
  backdropPath: string;
}

interface Genre {
  id: number;
  name: string;
}

export function AdminHome() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  const handleDeleteMovie = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json().then((apiResponse) => {
        if (apiResponse.success) {
          setMovies(movies.filter((movie) => movie.id !== id));
        }
      });
    });
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/movies`).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json().then((apiResponse) => {
        if (apiResponse.success && apiResponse.data) {
          setMovies(apiResponse.data);
        } else {
          throw new Error(apiResponse.message || "Failed to load movies data");
        }
      });
    });

    fetch(`${import.meta.env.VITE_API_URL}/api/genres`).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json().then((apiResponse) => {
        if (apiResponse.success && apiResponse.data) {
          setGenres(apiResponse.data);
        } else {
          throw new Error(apiResponse.message || "Failed to load genres data");
        }
      });
    });
  }, []);

  return (
    <div className="flex bg-[#0F0F0F] min-h-screen text-white mt-20">
      <main className="flex-1 p-6 space-y-6">
        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <StatCard
            icon={<FaFilm />}
            label="Всього фільмів"
            value={`${movies.length}`}
          />
          <StatCard
            icon={<FaThList />}
            label="Всього жанрів"
            value={`${genres.length}`}
          />
        </div>

        {/* Table */}
        <div className="bg-[#141418] rounded-lg border border-[#2D2D2D] overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-[#A9A9A9] bg-[#1C1B20]">
              <tr>
                <th className="p-4">ФОТО</th>
                <th className="p-4">НАЗВА</th>
                <th className="p-4 hidden sm:table-cell">ЖАНРИ</th>{" "}
                {/* Скрыто на мобильных */}
                <th className="p-4 hidden sm:table-cell">МОВА</th>{" "}
                {/* Скрыто на мобильных */}
                <th className="p-4 hidden sm:table-cell">РІК</th>{" "}
                {/* Скрыто на мобильных */}
                <th className="p-4 hidden sm:table-cell">ТРИВАЛІСТЬ</th>{" "}
                {/* Скрыто на мобильных */}
                <th className="p-4">ДІЇ</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-t border-[#333] hover:bg-[#1C1B20]"
                >
                  <td className="p-4">
                    <img
                      src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w500${
                        movie.posterPath
                      }`}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">{movie.title}</td>
                  <td className="p-4 hidden sm:table-cell">
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    {movie.originalLanguage}
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    {new Date(movie.releaseDate).getFullYear()}
                  </td>
                  <td className="p-4 hidden sm:table-cell">{`${Math.floor(
                    movie.runtime / 60
                  )}г ${movie.runtime % 60}хв`}</td>
                  <td className="p-8 flex gap-2">
                    <button
                      className="flex items-center gap-1 bg-green-700 hover:bg-green-800 px-2 py-1 rounded text-xs"
                      onClick={() => {
                        navigate(`edit-movie?id=${movie.id}`);
                      }}
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Ви впевнені, що хочете видалити "${movie.title}"?`
                          )
                        ) {
                          handleDeleteMovie(movie.id);
                        }
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="bg-[#141418] p-4 rounded border border-[#2D2D2D] flex items-center gap-4">
    <div className="text-red-500 text-2xl">{icon}</div>
    <div>
      <div className="text-sm text-[#A9A9A9]">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);
