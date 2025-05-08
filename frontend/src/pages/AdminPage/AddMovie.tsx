import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Suggestion {
  tmdbId: number;
  title: string;
  posterPath: string;
  releaseDate: string;
}

const AddMovie = () => {
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false); // Флаг, который отслеживает, был ли выполнен поиск
  const navigate = useNavigate();

  const fetchSuggestions = async (query: string) => {
    const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;
    if (!accessToken) {
      setError("Не вдалося отримати токен.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tmdb/search?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    const suggestions = data.data;
    setSuggestions(suggestions);
    setSearchPerformed(true); // Отмечаем, что поиск был выполнен
  };

  const handleAddMovie = async (tmdbId: number) => {
    const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;
    if (!accessToken) {
      setError("Не вдалося отримати токен.");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tmdb/movies`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tmdbId }),
      }
    );
    if (response.ok) {
      navigate("/admin");
    } else {
      setError("Помилка при додаванні фільму");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#1C1B20] text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Додати фільм</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Введіть назву фільму"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 rounded text-gray-500"
        />
        <button
          onClick={() => fetchSuggestions(search)}
          className="bg-[#FF4D4D] px-4 py-2 rounded hover:bg-[#ff6666]"
        >
          Знайти
        </button>
      </div>

      {suggestions.length ? (
        <ul className="bg-white text-black rounded shadow mb-4">
          {suggestions.map((s) => (
            <li
              key={s.title}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                if (
                  window.confirm(`Ви впевнені, що хочете додати "${s.title}"?`)
                ) {
                  handleAddMovie(s.tmdbId);
                }
              }}
            >
              <div className="flex items-center gap-2 justify-between">
                <div>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${s.posterPath}`}
                    alt={s.title}
                    className="w-10 h-10 rounded-full inline-block"
                  />
                  <span className="px-2">{s.title}</span>
                </div>
                <p>{s.releaseDate}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        searchPerformed && <p>Нічого не знайдено</p> // Показываем сообщение только если был выполнен поиск
      )}
    </div>
  );
};

export default AddMovie;
