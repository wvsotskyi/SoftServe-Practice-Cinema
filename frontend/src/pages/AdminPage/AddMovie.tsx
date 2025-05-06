import { useState } from "react";

interface Actor {
  name: string;
  role: string;
  photo: string;
}

interface Movie {
  title: string;
  duration: string;
  language: string;
  year: string;
  image: string;
  description: string;
  genre: string;
  trailer: string;
  cast: Actor[];
}

const mockMovies: Movie[] = [
  {
    title: "Назва фільму",
    duration: "0г 00хв",
    language: "Мова",
    year: "Рік",
    image: "placeholder.jpg",
    description: "Опис фільму буде тут...",
    genre: "Жанр",
    trailer: "https://www.youtube.com/embed/placeholder",
    cast: [
      {
        name: "Ім'я актора",
        role: "Роль",
        photo: "actor_placeholder.jpg",
      },
    ],
  },
];


const AddMovie = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = mockMovies.filter((m) =>
      m.title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSelectMovie = (m: Movie) => {
    setMovie({ ...m });
    setSearch(m.title);
    setSuggestions([]);
  };

  const handleFieldChange = (field: keyof Movie, value: string) => {
    if (movie) {
      setMovie({ ...movie, [field]: value });
    }
  };

  const handleActorChange = (index: number, field: keyof Actor, value: string) => {
    if (movie) {
      const updatedCast = [...movie.cast];
      updatedCast[index] = { ...updatedCast[index], [field]: value };
      setMovie({ ...movie, cast: updatedCast });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movie) {
      console.log("Збережений фільм:", movie);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#1C1B20] text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Додати фільм</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Введіть назву фільму"
          value={search}
          onChange={handleSearchChange}
          className="flex-1 p-2 rounded text-gray-500"
        />
        <button
          onClick={() => {
            const found = mockMovies.find((m) => m.title.toLowerCase() === search.toLowerCase());
            if (found) handleSelectMovie(found);
          }}
          className="bg-[#FF4D4D] px-4 py-2 rounded hover:bg-[#ff6666]"
        >
          Знайти
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="bg-white text-black rounded shadow mb-4">
          {suggestions.map((s) => (
            <li
              key={s.title}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelectMovie(s)}
            >
              {s.title}
            </li>
          ))}
        </ul>
      )}

{movie && (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block mb-1">Назва:</label>
        <input
          type="text"
          value={movie.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
        />
      </div>
      <div>
        <label className="block mb-1">Тривалість:</label>
        <input
          type="text"
          value={movie.duration}
          onChange={(e) => handleFieldChange("duration", e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
        />
      </div>

      <div>
        <label className="block mb-1">Мова фільму:</label>
        <input
          type="text"
          value={movie.language}
          onChange={(e) => handleFieldChange("language", e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
        />
      </div>
      <div>
        <label className="block mb-1">Рік випуску:</label>
        <input
          type="text"
          value={movie.year}
          onChange={(e) => handleFieldChange("year", e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="block mb-1">Постер:</label>
        <img
          src={`/images/${movie.image}`}
          alt={movie.title}
          className="w-48 h-auto mb-2 rounded"
        />

      </div>
      <div>
        <label className="block mb-1">Опис сюжету фільму:</label>
        <textarea
          value={movie.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="mb-4">
        <label className="block mb-1 text-gray-300">Жанр</label>
        <div className="relative">
          <select
            name="genre"
            className="w-full appearance-none p-3 pr-10 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
          >
            <option value="Бойовик">Бойовик</option>
            <option value="Комедія">Комедія</option>
            <option value="Драма">Драма</option>
            <option value="Фантастика">Фантастика</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-1">Трейлер (URL YouTube):</label>
        <input
          type="text"
          value={movie.trailer}
          onChange={(e) => handleFieldChange("trailer", e.target.value)}
          className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
        />
      </div>
    </div>

<div>
  <h3 className="text-lg font-semibold mb-2">Актори</h3>

  {movie.cast.map((actor, index) => (
    <div key={index} className="mb-6 flex items-center space-x-4">
      <div className="w-24 h-32">
        <img
          src={actor.photo || '/images/placeholder.jpg'} // Заглушка
          alt="Актор"
          className="w-full h-full object-cover rounded-lg bg-gray-300" 
        />
      </div>

      <div className="flex space-x-4 w-full">
        <div className="w-1/2">
          <label className="block mb-1">Ім’я:</label>
          <input
            type="text"
            value={actor.name}
            onChange={(e) => handleActorChange(index, "name", e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
          />
        </div>

        <div className="w-1/2">
          <label className="block mb-1">Роль:</label>
          <input
            type="text"
            value={actor.role}
            onChange={(e) => handleActorChange(index, "role", e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1C1B20] text-gray-200 border border-[#3F3D45] focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
          />
        </div>
      </div>
    </div>
  ))}
</div>


    <button
      type="submit"
      className="w-full bg-[#FF4D4D] hover:bg-[#ff6666] text-white py-3 rounded mt-6 font-semibold"
    >
      Опублікувати
    </button>
  </form>
)}
    </div>
  );
};
export default AddMovie;