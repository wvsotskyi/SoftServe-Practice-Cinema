export function AddSession() {
  return (
    <div className="max-w-3xl mx-auto bg-[#1C1B20] p-8 rounded-lg border border-[#A9A9A9] text-white">
      <h2 className="text-2xl font-bold mb-6">Додати сеанс</h2>

      <form className="flex flex-col gap-4">
        <div>
          <label className="text-sm">Фільм</label>
          <input
            type="text"
            placeholder="Назва фільму"
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Дата</label>
          <input
            type="date"
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Час</label>
          <input
            type="time"
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm">Зал</label>
          <input
            type="text"
            placeholder="Зал 1, 2 і т.д."
            className="w-full p-3 mt-1 bg-transparent border border-[#A9A9A9] rounded-lg focus:outline-none"
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
