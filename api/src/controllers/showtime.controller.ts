import { Request, Response } from 'express';
import {
  getShowtimesGroupedByMovie,
  getShowtimeFilterOptions,
  createShowtime
} from '@services/showtime.service.js';
import { APIResponse } from '@utils/apiResponse.js';
import { verifyAdmin } from '@middlewares/auth.middleware.js';

export async function getShowtimesGroupedByMovieController(req: Request, res: Response) {
  try {
    const { date, genreId, movieId } = req.query;
    const timeRange = req.query.timeRange
      ? JSON.parse(req.query.timeRange as string)
      : undefined;

    const filters = {
      ...(date && { date: date as string }),
      ...(timeRange && { timeRange }),
      ...(genreId && { genreId: Number(genreId) }),
      ...(movieId && { movieId: Number(movieId) })
    };

    const showtimes = await getShowtimesGroupedByMovie(filters);

    return APIResponse(res, {
      status: 200,
      message: 'Showtimes retrieved successfully',
      data: showtimes
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: error.status || 500,
      message: error.message || 'Failed to retrieve showtimes'
    });
  }
};

export async function getShowtimeFilterOptionsController(req: Request, res: Response) {
  try {
    const filterOptions = await getShowtimeFilterOptions();

    return APIResponse(res, {
      status: 200,
      message: 'Showtime filters retrieved successfully',
      data: filterOptions
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: error.status || 500,
      message: error.message || 'Failed to retrieve showtime filters'
    });
  }
};

export async function createShowtimeController(req: Request, res: Response) {
  try {
    await verifyAdmin(req, res, () => { });

    const { movieId, hallId, time, price } = req.body;

    // Validate required fields
    if (!movieId || !hallId || !time || price === undefined) {
      return APIResponse(res, {
        status: 400,
        message: 'All fields (movieId, hallId, time, price) are required'
      });
    }

    // Validate numeric fields
    if (isNaN(Number(movieId)) || isNaN(Number(hallId)) || isNaN(Number(price))) {
      return APIResponse(res, {
        status: 400,
        message: 'movieId, hallId, and price must be numbers'
      });
    }

    // Validate time is a valid date
    const showtimeDate = new Date(time);
    if (isNaN(showtimeDate.getTime())) {
      return APIResponse(res, {
        status: 400,
        message: 'Invalid time format'
      });
    }

    const showtime = await createShowtime({
      movieId: Number(movieId),
      hallId: Number(hallId),
      time: showtimeDate,
      price: Number(price)
    });

    return APIResponse(res, {
      status: 201,
      message: 'Showtime created successfully',
      data: showtime
    });

  } catch (error: any) {
    let status = 500;
    let message = error.message || 'Failed to create showtime';

    // Set appropriate status codes based on error message
    if (error.message === 'Unauthorized - Admin access required') {
      status = 403;
    } else if (error.message === 'Movie not found' || error.message === 'Hall not found') {
      status = 404;
    } else if (error.message === 'Hall is already booked at this time') {
      status = 409;
    }

    return APIResponse(res, {
      status,
      message
    });
  }
};