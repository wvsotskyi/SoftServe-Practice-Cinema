import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ModalForSessionDelete from "../../components/AdminModal/ModalForSessionDelete";

interface Movie {
  id: number;
  title: string;
  posterPath: string;
}

interface Showtime {
  id: number;
  hall: {
    id: number;
    name: string;
  };
  date: string;
  time: string;
  price: number;
}

interface MovieWithShowtimes {
  movie: Movie;
  showtimes: Showtime[];
}

export function ManageSessions() {
  const [movies, setMovies] = useState<MovieWithShowtimes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchShowtimes = async () => {
    const url = `${import.meta.env.VITE_API_URL}/api/showtimes`; 
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched showtimes:", data);
      setMovies(data);
    } catch (error) {
      console.error("Помилка при отриманні сеансів:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShowtime = async (id: number) => {
    const token = JSON.parse(localStorage.getItem("authTokens") || "{}").accessToken;

    await fetch(`${import.meta.env.VITE_API_URL}/api/showtimes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMovies((prev) =>
      prev.map((entry) => ({
        ...entry,
        showtimes: entry.showtimes.filter((s) => s.id !== id),
      }))
    );
  };

  const handleOpenModal = (showtimeId: number) => {
    setSelectedShowtimeId(showtimeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShowtimeId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedShowtimeId !== null) {
      await deleteShowtime(selectedShowtimeId);
      handleCloseModal();
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-20 text-white">
      <h2 className="text-3xl font-bold mb-6">Управління сеансами</h2>

      <button
        onClick={() => navigate("/admin/add-session")}
        className="w-full bg-[#FF4D4D] hover:bg-[#ff6666] text-white py-3 rounded mt-4 font-semibold mb-6 text-lg flex items-center justify-center gap-2"
      >
        <FiPlus />
        Додати сеанс
      </button>

      {isLoading ? (
        <p className="text-gray-400 text-center">Почекайте завантаження сеансів...</p>
      ) : (
        movies.map(({ movie, showtimes }) => (
          <div key={movie.id} className="bg-[#141418] mb-8 rounded-lg border border-[#2D2D2D] p-4 overflow-x-auto">
            <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
            <table className="min-w-full text-sm">
              <thead className="bg-[#1C1B20] text-left text-[#A9A9A9]">
                <tr>
                  <th className="p-3 hidden sm:table-cell">Зал</th>
                  <th className="p-3">Дата</th>
                  <th className="p-3">Час</th>
                  <th className="p-3 hidden sm:table-cell">Ціна</th>
                  <th className="p-3">Дії</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.map((s) => (
                  <tr key={s.id} className="border-t border-[#333] hover:bg-[#1C1B20]">
                    <td className="p-3 hidden sm:table-cell">{s.hall.name}</td>
                    <td className="p-3">{new Date(s.date).toLocaleDateString()}</td>
                    <td className="p-3">{s.time}</td>
                    <td className="p-3 hidden sm:table-cell">{s.price} грн</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        className="flex items-center gap-1 bg-green-700 hover:bg-green-800 px-2 sm:px-3 py-1 rounded text-xs"
                       // onClick={() => navigate(`/admin/edit-session`)}
                        onClick={() => navigate(`/admin/edit-session?id=${s.id}`)}
                      >
                        <FiEdit /> <span className="hidden sm:inline">Редагувати</span>
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-700 hover:bg-red-800 px-2 sm:px-3 py-1 rounded text-xs"
                        onClick={() => handleOpenModal(s.id)}
                      >
                        <FiTrash2 /> <span className="hidden sm:inline">Видалити</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      <ModalForSessionDelete
        isOpen={isModalOpen}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
