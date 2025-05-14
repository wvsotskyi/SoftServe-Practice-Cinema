import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
}

interface Hall {
  id: number;
  name: string;
}

export function AddSession() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [movieId, setMovieId] = useState<number | "">("");
  const [hallId, setHallId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");


  const navigate = useNavigate();

  const accessToken = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;

  useEffect(() => {
    if (!accessToken) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/movies`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setMovies(data.data || data));

    fetch(`${import.meta.env.VITE_API_URL}/api/halls`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setHalls(data.data || data));
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const priceValue = parseFloat(price);
  if (!movieId || !date || !time || !hallId || isNaN(priceValue) || priceValue <= 0) {
    setErrorMessage("Будь ласка, заповніть всі поля.");
    return;
  }

  const token = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;

  const newShowtime = {
    movieId,
    hallId,
    date,
    time,
    price: priceValue,
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/showtimes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newShowtime),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Помилка ${response.status}: ${text}`);
    }

    setErrorMessage(""); 
    setSuccessMessage("Сеанс успішно доданий!");
    setTimeout(() => navigate("/admin/manage-session"), 1500);
  } catch (error) {
    console.error("Помилка при додаванні сеансу:", error);
    setErrorMessage("Помилка під час додавання сеансу.");
  }
};


  return (
    <div className="max-w-3xl mx-auto bg-[#1C1B20] p-8 rounded-lg border border-[#A9A9A9] text-white mt-30">
      <h2 className="text-2xl font-bold mb-6">Додати сеанс</h2>

            {errorMessage && (
        <div className="text-red-500 text-center font-semibold mb-4">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="text-green-400 text-center font-semibold mb-4">
          {successMessage}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm">Фільм</label>
          <select
            value={movieId}
            onChange={(e) => setMovieId(+e.target.value)}
            className="w-full p-3 mt-1 bg-[#1C1B20] text-white border border-[#A9A9A9] rounded-lg focus:outline-none appearance-none"
          >
            <option value="">Оберіть фільм</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Час</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Зал</label>
          <select
            value={hallId}
            onChange={(e) => setHallId(+e.target.value)}
            className="w-full p-3 mt-1 bg-[#1C1B20] text-white border border-[#A9A9A9] rounded-lg focus:outline-none appearance-none"
          >
            <option value="">Оберіть зал</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Ціна</label>
          <input
            type="text"
            placeholder="Ціна сеанса"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none appearance-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#FF6347] hover:bg-[#FF4500] text-white p-3 mt-4 rounded-lg"
        >
          Додати сеанс
        </button>
      </form>
    </div>
  );
}
