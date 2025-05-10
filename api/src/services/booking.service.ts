import prisma from '@utils/db.js';

interface CreateBookingParams {
  userId: number;
  showtimeId: number;
  seatIds: number[];
}

export async function createBooking({ userId, showtimeId, seatIds }: CreateBookingParams) {
  return await prisma.$transaction(async (tx) => {
    // Verify seats are available
    const occupiedSeats = await tx.booking.findMany({
      where: {
        showtimeId,
        seats: {
          some: {
            id: { in: seatIds }
          }
        }
      },
      select: { seats: { select: { id: true } } }
    });

    if (occupiedSeats.length > 0) {
      throw new Error('Some seats are already booked');
    }

    // Get showtime details
    const showtime = await tx.showtime.findUnique({
      where: { id: showtimeId },
      include: { movie: true }
    });

    if (!showtime) {
      throw new Error('Showtime not found');
    }

    // Calculate total price
    const totalPrice = showtime.price * seatIds.length;

    // Create booking
    return await tx.booking.create({
      data: {
        userId,
        showtimeId,
        totalPrice,
        seats: {
          connect: seatIds.map(id => ({ id }))
        }
      },
      include: {
        showtime: true,
        seats: true
      }
    });
  });
};

export async function getBookingsByUser(userId: number) {
  return await prisma.booking.findMany({
    where: { userId },
    include: {
      showtime: { include: { movie: true } },
      seats: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export async function updateBooking(bookingId: number, userId: number, updates: {
  seatIds?: number[];
  status?: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
})  {
  return await prisma.$transaction(async (tx) => {
    // Verify booking exists and belongs to user
    const booking = await tx.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || booking.userId !== userId) {
      throw new Error('Booking not found or unauthorized');
    }

    // Handle seat changes if provided
    if (updates.seatIds) {
      // Verify new seats are available
      const occupiedSeats = await tx.booking.findMany({
        where: {
          showtimeId: booking.showtimeId,
          seats: {
            some: {
              id: { in: updates.seatIds }
            }
          },
          NOT: { id: bookingId }
        },
        select: { seats: { select: { id: true } } }
      });

      if (occupiedSeats.length > 0) {
        throw new Error('Some seats are already booked');
      }
    }

    // Update booking
    return await tx.booking.update({
      where: { id: bookingId },
      data: {
        seats: updates.seatIds ? {
          set: updates.seatIds.map(id => ({ id }))
        } : undefined,
        status: updates.status
      },
      include: {
        showtime: { include: { movie: true } },
        seats: true
      }
    });
  });
};

export async function cancelBooking  (bookingId: number, userId: number)  {
  return await prisma.booking.updateMany({
    where: {
      id: bookingId,
      userId,
      status: 'CONFIRMED'
    },
    data: {
      status: 'CANCELLED'
    }
  });
};