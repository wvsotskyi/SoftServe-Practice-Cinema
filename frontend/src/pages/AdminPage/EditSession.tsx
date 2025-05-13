import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
}

interface Hall {
  id: number;
  name: string;
}

interface Showtime {
  movieId: number | "";
  hallId: number | "";
  date: string;
  time: string;
  price: number | "";
}

export function EditSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("id");

  const accessToken = JSON.parse(
    localStorage.getItem("authTokens") || "{}"
  ).accessToken;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [session, setSession] = useState<Showtime>({
    movieId: "",
    hallId: "",
    date: "",
    time: "",
    price: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!sessionId || !accessToken) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/showtimes/${sessionId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setSession({
          movieId: data.movieId,
          hallId: data.hallId,
          date: (new Date(data.date)).toISOString().split('T')[0],
          time: data.time,
          price: data.price,
        });
      });

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
  }, [sessionId, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !accessToken) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/showtimes/${sessionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(session),
        }
      );

      if (res.ok) {
        setSuccessMessage("Сеанс успішно оновлено!");
        setTimeout(() => navigate("/admin/manage-session"), 1500);
      } else {
        alert("Не вдалося оновити сеанс");
      }
    } catch {
      alert("Помилка з'єднання з сервером");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#1C1B20] p-8 rounded-lg border border-[#A9A9A9] text-white mt-30">
      <h2 className="text-2xl font-bold mb-6">Редагувати сеанс</h2>

      {successMessage && (
        <div className="text-green-400 text-center font-semibold mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm">Фільм</label>
          <select
            value={session.movieId}
            onChange={(e) =>
              setSession({ ...session, movieId: +e.target.value })
            }
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-white border border-[#A9A9A9] appearance-none"
          >
            <option value="">Оберіть фільм</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Дата</label>
          <input
            type="date"
            value={session.date}
            onChange={(e) => setSession({ ...session, date: e.target.value })}
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Час</label>
          <input
            type="time"
            value={session.time}
            onChange={(e) => setSession({ ...session, time: e.target.value })}
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Зал</label>
          <select
            value={session.hallId}
            onChange={(e) =>
              setSession({ ...session, hallId: +e.target.value })
            }
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-white border border-[#A9A9A9] appearance-none"
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
            inputMode="numeric"
            pattern="[0-9]*"
            value={session.price}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setSession({ ...session, price: value === "" ? "" : +value });
              }
            }}
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none appearance-none"
          />
        </div>

        <button
          type="submit"
          className="bg-[#FF6347] hover:bg-[#FF4500] text-white p-3 mt-4 rounded-lg"
        >
          Редагувати сеанс
        </button>
      </form>
    </div>
  );
}
