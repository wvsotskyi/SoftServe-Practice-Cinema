import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Genre {
  id: number;
  name: string;
}

interface Hall {
  id: number;
  name: string;
}

interface Showtime {
  id: number;
  time: string;
  date: string;
  price: number;
  hall: Hall;
}

interface MovieDetails {
  id: number;
  title: string;
  posterPath: string;
  adult: boolean;
}

interface MovieFromShowtimes extends MovieDetails {
  showtimes: Showtime[];
}

interface FiltersResponse {
  genres: Genre[];
  dates: string[];
  times: string[];
}

export function Session() {
  const [movies, setMovies] = useState<MovieFromShowtimes[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/showtimes/filters`)
      .then((res) => res.json())
      .then((data: FiltersResponse) => {
        setAllGenres(data.genres);
        setAvailableDates(data.dates);
        setAvailableTimes(data.times);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedDate) params.append("date", selectedDate);
    if (selectedGenreId) params.append("genreId", selectedGenreId.toString());
    if (selectedTime) params.append("time", selectedTime);

    fetch(`${import.meta.env.VITE_API_URL}/api/showtimes?${params.toString()}`)
      .then((res) => res.json())
      .then((data: Array<{ movie: MovieDetails; showtimes: Showtime[] }>) => {
        const moviesFromShowtimes = data.map((item) => ({
          ...item.movie,
          showtimes: item.showtimes,
        }));
        setMovies(moviesFromShowtimes);
      })
      .catch(console.error);
  }, [selectedDate, selectedGenreId, selectedTime]);

  const resetFilters = () => {
    setSelectedGenreId(null);
    setSelectedDate("");
    setSelectedTime("");
    setShowMobileFilters(false);
  };

  return (
    <div className="pt-20 p-4 max-w-7xl mx-auto">
      {/* Desktop Filters */}
      <div className="hidden md:flex flex-col items-center max-w-6xl mx-auto md:flex-row gap-4 mb-6 flex-wrap p-4 rounded-lg">
        <select
          value={selectedGenreId ?? ""}
          onChange={(e) =>
            setSelectedGenreId(e.target.value ? Number(e.target.value) : null)
          }
          className="p-3 border-1 border-[#6F6C6C] rounded-lg bg-[#1C1B20] text-[#FFFFFF] focus:outline-none focus:border-blue-500 flex-1 min-w-[200px]"
        >
          <option value="">Обрати жанр</option>
          {allGenres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-3 border-1 border-[#6F6C6C] rounded-lg bg-[#1C1B20] text-[#FFFFFF] focus:outline-none focus:border-blue-500 flex-1 min-w-[200px]"
        >
          <option value="">Обрати дату</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={!selectedDate}
          className="p-3 border-1 border-[#6F6C6C] rounded-lg bg-[#1C1B20] text-[#FFFFFF] focus:outline-none focus:border-blue-500 disabled:opacity-50 flex-1 min-w-[200px]"
        >
          <option value="">Обрати час</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <button
          onClick={resetFilters}
          className="p-3 bg-[#FF4C4C] text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex-1 min-w-[200px]"
        >
          Скинути фільтри
        </button>
      </div>

      {/* Mobile Filters */}
      <div className="md:hidden flex flex-col items-center mb-6">
        <div className="w-full flex gap-2 mb-2 mt-3">
          <select
            value={selectedGenreId ?? ""}
            onChange={(e) =>
              setSelectedGenreId(e.target.value ? Number(e.target.value) : null)
            }
            className="p-3 border-1 border-[#6F6C6C] rounded-lg bg-[#1C1B20] text-[#FFFFFF] focus:outline-none focus:border-blue-500 flex-1"
          >
            <option value="">Обрати жанр</option>
            {allGenres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="p-3 bg-[#1C1B20] border border-[#6F6C6C] text-white rounded-lg"
          >
            {showMobileFilters ? "▲" : "▼"} Додаткові фільтри
          </button>
        </div>

        {showMobileFilters && (
          <div className="w-full space-y-2 bg-[#1C1B20] p-4 rounded-lg">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border-1 border-[#6F6C6C] rounded-lg bg-[#2A292E] text-[#FFFFFF] focus:outline-none focus:border-blue-500"
            >
              <option value="">Обрати дату</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>

            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!selectedDate}
              className="w-full p-3 border-1 border-[#6F6C6C] rounded-lg bg-[#2A292E] text-[#FFFFFF] focus:outline-none focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">Обрати час</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="w-full p-3 bg-[#FF4C4C] text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {movies?.map((movie) => (
          <div
            key={movie.id}
            className="bg-[#1C1B20] border border-[#979797] p-6 rounded-xl shadow-md"
          >
            <div className="mb-6">
              <h2 className="md:text-[30px] text-[18px] font-bold text-white mb-2">
                {movie.title}
              </h2>
              <div className="flex items-center gap-2 text-white md:text-[20px] text-[12px]">
                <span>{movie.adult ? "18+" : "Всі віки"}</span>
              </div>
            </div>

            <div className="grid grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-2">
              {movie.showtimes?.map?.((showtime) => (
                <Link
                  key={showtime.id}
                  to={`/booking/${showtime.id}`}
                  state={{
                    movie: {
                      id: movie.id,
                      title: movie.title,
                      posterPath: movie.posterPath,
                    },
                    showtime: {
                      id: showtime.id,
                      time: showtime.time,
                      date: showtime.date,
                      price: showtime.price,
                      hall: showtime.hall,
                    },
                  }}
                  className="p-1 border-2 border-gray-600 rounded-lg hover:border-blue-400 transition-colors text-center bg-[#1C1B20]"
                >
                  <p className="md:text-[20px] text-[10px] font-semibold text-white">
                    {new Date(
                      `${showtime.date.split("T")[0]}T${showtime.time}:00Z`
                    ).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC"
                    })}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
