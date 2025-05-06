import { useEffect, useState } from "react"; 
import { FaFilm, FaThList, FaRegDotCircle } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Movie {
  id: number;
  title: string;
  genre: string;
  language: string;
  year: string;
  duration: string;
  image: string;
}

const AdminHome = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies([
      {
        id: 1,
        title: "Назва фільму",
        genre: "Жанр фільму",
        language: "Мова",
        year: "Рік",
        duration: "0г 0хв",
        image: "/images/poster1.jpg",
      },
      {
        id: 2,
        title: "Назва фільму",
        genre: "Жанр фільму",
        language: "Мова",
        year: "Рік",
        duration: "0г 0хв",
        image: "/images/poster2.jpg",
      },
    ]);
  }, []);

  return (
    <div className="flex bg-[#0F0F0F] min-h-screen text-white">

      <main className="flex-1 p-6 space-y-6">
        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard icon={<FaFilm />} label="Всього фільмів" value="0" />
          <StatCard icon={<FaThList />} label="Всього жанрів" value="0" />
          <StatCard icon={<FaRegDotCircle />} label="Всього дій" value="0" />
        </div>

        {/* Table */}
        <div className="bg-[#141418] rounded-lg border border-[#2D2D2D] overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-[#A9A9A9] bg-[#1C1B20]">
              <tr>
                <th className="p-4">ФОТО</th>
                <th className="p-4">НАЗВА</th>
                <th className="p-4 hidden sm:table-cell">ЖАНР</th> {/* Скрыто на мобильных */}
                <th className="p-4 hidden sm:table-cell">МОВА</th>  {/* Скрыто на мобильных */}
                <th className="p-4 hidden sm:table-cell">РІК</th>   {/* Скрыто на мобильных */}
                <th className="p-4 hidden sm:table-cell">ТРИВАЛІСТЬ</th> {/* Скрыто на мобильных */}
                <th className="p-4">ДІЇ</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id} className="border-t border-[#333] hover:bg-[#1C1B20]">
                  <td className="p-4">
                    <img src={movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="p-4">{movie.title}</td>
                  <td className="p-4 hidden sm:table-cell">{movie.genre}</td> 
                  <td className="p-4 hidden sm:table-cell">{movie.language}</td>  
                  <td className="p-4 hidden sm:table-cell">{movie.year}</td>   
                  <td className="p-4 hidden sm:table-cell">{movie.duration}</td> 
                  <td className="p-8 flex gap-2">
                    <button className="flex items-center gap-1 bg-green-700 hover:bg-green-800 px-2 py-1 rounded text-xs">
                      <FiEdit /> Edit
                    </button>
                    <button className="flex items-center gap-1 bg-red-700 hover:bg-red-800 px-2 py-1 rounded text-xs">
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

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-[#141418] p-4 rounded border border-[#2D2D2D] flex items-center gap-4">
    <div className="text-red-500 text-2xl">{icon}</div>
    <div>
      <div className="text-sm text-[#A9A9A9]">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  </div>
);

export default AdminHome;
