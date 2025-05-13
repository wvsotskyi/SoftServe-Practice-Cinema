import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

interface Seat {
  id: number;
  row: number;
  number: number;
  status: "available" | "booked" | "selected";
}

interface BookingData {
  movie: {
    id: number;
    title: string;
    posterPath: string;
  };
  showtime: {
    id: number;
    time: string;
    date: string;
    price: number;
    hall: Hall;
  };
}

interface Hall {
  id: number;
  name: string;
}

interface ApiSeat {
  id: number;
  row: number;
  number: number;
  isTaken: boolean;
}

export function Booking() {
  const { state } = useLocation();
  const { showtimeId } = useParams();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  const bookingData = state as BookingData;

  const { date, time } = bookingData.showtime;
  const [hours, minutes] = time.split(":").map(Number);
  const dateObj = new Date(date);
  const showDateTime = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    hours,
    minutes
  );

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/halls/${bookingData.showtime.hall.id}/seats?showtimeId=${showtimeId}`
        );
        const raw = await response.json();

        const data: ApiSeat[] = raw.data.seats;

        const mappedSeats: Seat[] = data.map((seat) => ({
          id: seat.id,
          row: seat.row,
          number: seat.number,
          status: seat.isTaken ? "booked" : "available",
        }));

        setSeats(mappedSeats);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [showtimeId, bookingData.showtime.hall.id]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked") return;

    const newStatus = seat.status === "available" ? "selected" : "available";
    const updatedSeats: Seat[] = seats.map((s) =>
      s.id === seat.id ? { ...s, status: newStatus } : s
    );

    setSeats(updatedSeats);
    setSelectedSeats(updatedSeats.filter((s) => s.status === "selected"));
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Оберіть місця для бронювання");
      return;
    }

    const storedTokens = localStorage.getItem("authTokens");
    if (!storedTokens) {
      alert("Для бронювання необхідно увійти в систему");
      return;
    }

    try {
      const { accessToken } = JSON.parse(storedTokens);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          showtimeId: Number(showtimeId),
          seatIds: selectedSeats.map((s) => s.id),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Помилка бронювання");
      }

      const result = await response.json();
      const bookingId = result.data?.id || result.id || "не вказано";
      alert(`Бронювання успішне! Номер бронювання: ${bookingId}`);

      const updatedSeats = seats.map((seat) =>
        selectedSeats.some((s) => s.id === seat.id)
          ? { ...seat, status: "booked" as const }
          : seat
      );
      setSeats(updatedSeats);
      setSelectedSeats([]);
    } catch (error) {
      let errorMessage = "Не вдалося забронювати місця";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Помилка бронювання:", error);
      alert(errorMessage);
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div className="pt-20 pl-0 md:pl-10 mx-auto relative">
      <div className="grid grid-cols-1 md:grid-cols-[80%_20%] min-h-screen">
        {/* Left Column */}
        <div className="flex flex-col w-full pt-6">
          <div className="md:hidden flex gap-4 mb-6 px-4">
            <div className="w-1/3">
              <img
                src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w300${bookingData.movie.posterPath}`}
                alt={bookingData.movie.title}
                className="rounded-lg w-full"
              />
            </div>
            <div className="w-2/3 flex flex-col gap-2">
              <h1 className="md:hidden text-2xl font-bold text-white mb-4 px-4 text-center">
                {bookingData.movie.title}
              </h1>
              <div className="flex items-center border border-gray-500 rounded-md overflow-hidden">
                <div className="bg-[#1C1B20] p-2 flex items-center border-r border-gray-500 h-full self-stretch">
                  <img
                    src={`${import.meta.env.VITE_PUBLIC_URL}/svg/location.svg`}
                    alt="Location"
                    className="w-4 h-4"
                  />
                </div>
                <div className="px-2 py-1 text-white">
                  <p className="text-sm">Місце</p>
                  <span className="text-xs">
                    {bookingData.showtime.hall.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center border border-gray-500 rounded-md overflow-hidden">
                <div className="bg-[#1C1B20] p-2 flex items-center border-r border-gray-500 h-full self-stretch">
                  <img
                    src={`${import.meta.env.VITE_PUBLIC_URL}/svg/date.svg`}
                    alt="Date"
                    className="w-4 h-4"
                  />
                </div>
                <div className="px-2 py-1 text-white">
                  <p className="text-xs">
                    {new Date(showDateTime).toLocaleDateString(
                      "uk-UA",
                      {
                        weekday: "long",
                      }
                    )}
                  </p>
                  <span className="text-xs">
                    {new Date(showDateTime).toLocaleDateString(
                      "uk-UA",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center border border-gray-500 rounded-md overflow-hidden">
                <div className="bg-[#1C1B20] p-2 flex items-center border-r border-gray-500 h-full self-stretch">
                  <img
                    src={`${import.meta.env.VITE_PUBLIC_URL}/svg/time.svg`}
                    alt="Time"
                    className="w-4 h-4"
                  />
                </div>
                <div className="px-2 py-1 text-white">
                  <p className="text-xs">Час</p>
                  <span className="text-xs">
                    {new Date(showDateTime).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-full">
            <div className="mb-8">
              <img
                src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w300${bookingData.movie.posterPath}`}
                alt={bookingData.movie.title}
                className="rounded-lg"
              />
            </div>

            <div className="p-6 pt-0 rounded-xl mb-8 flex-1">
              <h1 className="text-3xl font-bold text-white mb-4 text-center">
                {bookingData.movie.title}
              </h1>

              <div className="text-white mb-8 flex justify-center gap-4">
                <div className="flex items-center border border-gray-500 rounded-md overflow-hidden w-fit">
                  <div className="bg-[#1C1B20] p-2 flex items-center border-r border-gray-500 h-full self-stretch">
                    <img
                      src={`${
                        import.meta.env.VITE_PUBLIC_URL
                      }/svg/location.svg`}
                      alt="Location"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="px-3 py-2 whitespace-nowrap">
                    <p>Місце</p>
                    <span>Зал: {bookingData.showtime.hall.name}</span>
                  </div>
                </div>

                <div className="flex items-center border border-gray-500 rounded-md overflow-hidden w-fit">
                  <div className="bg-[#1C1B20] p-2 flex items-center border-r border-gray-500 h-full self-stretch">
                    <img
                      src={`${import.meta.env.VITE_PUBLIC_URL}/svg/date.svg`}
                      alt="Date"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="px-3 py-2 whitespace-nowrap">
                    <span>
                      <p>
                        {new Date(showDateTime).toLocaleDateString(
                          "uk-UA",
                          {
                            weekday: "long",
                          }
                        )}
                      </p>
                      {new Date(showDateTime).toLocaleDateString(
                        "uk-UA",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center border border-gray-500 rounded-md overflow-hidden w-fit">
                  <div className="bg-[#1C1B20] p-2 flex items-center border-r border-gray-500 h-full self-stretch">
                    <img
                      src={`${import.meta.env.VITE_PUBLIC_URL}/svg/time.svg`}
                      alt="Time"
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="px-3 py-2 whitespace-nowrap">
                    <span>
                      <p>Час</p>
                      {new Date(showDateTime).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          timeZone: "UTC",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8 text-center" style={{ width: "100%" }}>
                <img
                  src={`${import.meta.env.VITE_PUBLIC_URL}/svg/screen.svg`}
                  alt="Screen"
                  className="mx-auto mb-2 h-6 w-full"
                />
                <span className="text-white">ЕКРАН</span>
              </div>

              <div className="grid gap-1.5 justify-center">
                {Array.from(new Set(seats.map((s) => s.row))).map((row) => (
                  <div key={row} className="flex gap-2">
                    {seats
                      .filter((s) => s.row === row)
                      .sort((a, b) => a.number - b.number)
                      .map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-8 h-[43px] rounded-sm border ${
                            seat.status === "booked"
                              ? "bg-[#D9D9D9] cursor-not-allowed"
                              : seat.status === "selected"
                                ? "bg-blue-500"
                                : "bg-transparent border-gray-400 hover:border-gray-200"
                          }`}
                          title={`Ряд ${row}, Місце ${seat.number}`}
                        />
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden px-4">
            <div className="mb-8 text-center">
              <img
                src={`${import.meta.env.VITE_PUBLIC_URL}/svg/screen.svg`}
                alt="Screen"
                className="mx-auto mb-2 h-6 w-full"
              />
              <span className="text-white">ЕКРАН</span>
            </div>

            <div className="grid gap-y-1 gap-x-5 justify-center pb-10">
              {Array.from(new Set(seats.map((s) => s.row))).map((row) => (
                <div key={row} className="flex gap-x-[5px]">
                  {seats
                    .filter((s) => s.row === row)
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-5 h-[27px] rounded-sm border ${
                          seat.status === "booked"
                            ? "bg-[#D9D9D9] cursor-not-allowed"
                            : seat.status === "selected"
                              ? "bg-blue-500"
                              : "bg-transparent border-gray-400 hover:border-gray-200"
                        }`}
                        title={`Ряд ${row}, Місце ${seat.number}`}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-[#1C1B20] p-6 pb-12 flex flex-col md:sticky md:top-[80px] md:h-[calc(100vh-80px)]">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-4">Ваш вибір</h2>
            {selectedSeats.length === 0 ? (
              <p className="text-gray-400">Оберіть місця</p>
            ) : (
              <>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 space-y-4">
                    {selectedSeats.map((seat) => (
                      <div
                        key={seat.id}
                        className="text-white w-full flex gap-4 items-start"
                      >
                        <img
                          src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w300${bookingData.movie.posterPath}`}
                          alt={bookingData.movie.title}
                          className="w-20 rounded-lg md:block"
                        />

                        <div className="flex-1">
                          <p className="text-sm text-gray-300">
                            {new Date(
                              showDateTime
                            ).toLocaleDateString("uk-UA", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-base">Місце {seat.number}</p>
                          <div className="text-sm flex justify-between w-full">
                            <span>Ряд {seat.row}</span>
                            <span>Ціна: {bookingData.showtime.price} грн</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xl font-bold text-white mb-4 border-t pt-4">
                  Всього: {selectedSeats.length * bookingData.showtime.price}{" "}
                  грн
                </div>
              </>
            )}
          </div>

          <div className="mt-auto">
            <button
              onClick={handleBooking}
              className="w-full bg-[#FF4C4C] text-white py-3 rounded-lg hover:bg-red-600 transition"
            >
              Забронювати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
