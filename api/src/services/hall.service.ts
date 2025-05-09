import prisma from '@utils/db.js';
import { Seat, Hall } from '../../generated/prisma/default.js';

interface HallWithSeats extends Hall {
  seats: (Seat & { isTaken: boolean })[];
  rows: number;
  seatsPerRow: number;
}

export async function getHallWithSeats(hallId: number, showtimeId?: number): Promise<HallWithSeats | null> {
  // Get the hall with all its seats
  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
    include: {
      seats: {
        orderBy: [
          { row: 'asc' },
          { number: 'asc' }
        ]
      }
    }
  });

  if (!hall) {
    return null;
  }

  // Get all taken seat IDs for the specific showtime if provided
  let takenSeatIds: number[] = [];
  if (showtimeId) {
    const bookings = await prisma.booking.findMany({
      where: {
        showtimeId,
        status: 'CONFIRMED' // Only count confirmed bookings
      },
      include: {
        seats: {
          select: { id: true }
        }
      }
    });

    takenSeatIds = bookings.flatMap(booking =>
      booking.seats.map(seat => seat.id)
    );
  }

  // Calculate hall size (rows and seats per row)
  let rows = 0;
  let seatsPerRow = 0;

  if (hall.seats.length > 0) {
    // Find the maximum row number
    rows = Math.max(...hall.seats.map(seat => seat.row));

    // Find the maximum seat number in the first row to get seats per row
    seatsPerRow = Math.max(
      ...hall.seats.filter(seat => seat.row === 1).map(seat => seat.number)
    );
  }

  // Add isTaken property to each seat
  const seatsWithStatus = hall.seats.map(seat => ({
    ...seat,
    isTaken: takenSeatIds.includes(seat.id)
  }));

  return {
    ...hall,
    seats: seatsWithStatus,
    rows,
    seatsPerRow
  };
};

export async function getHallSize  (hallId: number): Promise<{ rows: number; seatsPerRow: number } | null>  {
  const seats = await prisma.seat.findMany({
    where: { hallId },
    orderBy: [
      { row: 'asc' },
      { number: 'asc' }
    ]
  });

  if (seats.length === 0) {
    return null;
  }

  const rows = Math.max(...seats.map(seat => seat.row));
  const seatsPerRow = Math.max(
    ...seats.filter(seat => seat.row === 1).map(seat => seat.number)
  );

  return { rows, seatsPerRow };
};


export async function getAllHalls  (showtimeId?: number): Promise<HallWithSeats[]>  {
  // Get all halls with their seats
  const halls = await prisma.hall.findMany({
    include: {
      seats: {
        orderBy: [
          { row: 'asc' },
          { number: 'asc' }
        ]
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Get all taken seat IDs for the specific showtime if provided
  let takenSeatIds: number[] = [];
  if (showtimeId) {
    const bookings = await prisma.booking.findMany({
      where: {
        showtimeId,
        status: 'CONFIRMED'
      },
      include: {
        seats: {
          select: { id: true }
        }
      }
    });
    takenSeatIds = bookings.flatMap(booking => booking.seats.map(seat => seat.id));
  }

  return halls.map(hall => {
    // Calculate hall size
    let rows = 0;
    let seatsPerRow = 0;

    if (hall.seats.length > 0) {
      rows = Math.max(...hall.seats.map(seat => seat.row));
      seatsPerRow = Math.max(
        ...hall.seats.filter(seat => seat.row === 1).map(seat => seat.number)
      );
    }

    // Add isTaken status to seats
    const seatsWithStatus = hall.seats.map(seat => ({
      ...seat,
      isTaken: takenSeatIds.includes(seat.id)
    }));

    return {
      ...hall,
      seats: seatsWithStatus,
      rows,
      seatsPerRow
    };
  });
};

export async function getAllHallsBasic (): Promise<{ id: number; name: string; rows: number; seatsPerRow: number }[]> {
  const halls = await prisma.hall.findMany({
    include: {
      seats: true
    }
  });

  return halls.map(hall => {
    let rows = 0;
    let seatsPerRow = 0;

    if (hall.seats.length > 0) {
      rows = Math.max(...hall.seats.map(seat => seat.row));
      seatsPerRow = Math.max(
        ...hall.seats.filter(seat => seat.row === 1).map(seat => seat.number)
      );
    }

    return {
      id: hall.id,
      name: hall.name,
      rows,
      seatsPerRow
    };
  });
};