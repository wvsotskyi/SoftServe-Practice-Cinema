import { Request, Response } from 'express';
import {
  createBooking,
  getBookingsByUser,
  updateBooking,
  cancelBooking
} from '@services/booking.service.js';
import { APIResponse } from '@utils/apiResponse.js';

export async function createBookingController(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const { showtimeId, seatIds } = req.body;

    if (!userId) {
      return APIResponse(res, {
        status: 401,
        message: 'Authentication required'
      });
    }

    const booking = await createBooking({ userId, showtimeId, seatIds });

    return APIResponse(res, {
      status: 201,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to create booking'
    });
  }
};

export async function getUserBookingsController(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return APIResponse(res, {
        status: 401,
        message: 'Authentication required'
      });
    }

    const bookings = await getBookingsByUser(userId);

    return APIResponse(res, {
      status: 200,
      message: 'Bookings retrieved successfully',
      data: bookings
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to retrieve bookings'
    });
  }
};

export async function updateBookingController(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const bookingId = Number(req.params.id);
    const { seatIds, status } = req.body;

    if (!userId) {
      return APIResponse(res, {
        status: 401,
        message: 'Authentication required'
      });
    }

    const booking = await updateBooking(bookingId, userId, { seatIds, status });

    return APIResponse(res, {
      status: 200,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to update booking'
    });
  }
};

export async function cancelBookingController(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const bookingId = Number(req.params.id);

    if (!userId) {
      return APIResponse(res, {
        status: 401,
        message: 'Authentication required'
      });
    }

    await cancelBooking(bookingId, userId);

    return APIResponse(res, {
      status: 200,
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Failed to cancel booking'
    });
  }
};