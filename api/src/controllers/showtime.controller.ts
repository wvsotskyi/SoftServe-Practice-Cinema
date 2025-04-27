import { Request, Response } from 'express';
import { getShowtimesGroupedByMovie } from '@services/showtime.service.js';
import { APIResponse } from '@utils/apiResponse.js';

export const getShowtimesController = async (req: Request, res: Response) => {
    try {
      const { date, startTime, endTime, genreId, movieId } = req.query;
  
      const filters = {
        date: date as string | undefined,
        timeRange: {
          start: startTime as string | undefined,
          end: endTime as string | undefined
        },
        genreId: genreId ? Number(genreId) : undefined,
        movieId: movieId ? Number(movieId) : undefined
      };
  
      const moviesWithShowtimes = await getShowtimesGroupedByMovie(filters);
  
      const responseData = moviesWithShowtimes.map(movie => ({
        movieId: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        showtimes: movie.showtimes.map(showtime => {
          // Calculate booked seats count
          const bookedSeatsCount = showtime.bookings
            .flatMap(b => b.seats)
            .length;
          
          // Get total seats from the hall
          const totalSeats = showtime.hall.seats.length;
  
          return {
            id: showtime.id,
            time: showtime.time,
            price: showtime.price,
            hall: {
              id: showtime.hall.id,
              name: showtime.hall.name
            },
            availableSeats: totalSeats - bookedSeatsCount
          };
        })
      }));
  
      return APIResponse(res, {
        status: 200,
        message: 'Showtimes retrieved successfully',
        data: responseData
      });
    } catch (error: any) {
      return APIResponse(res, {
        status: 400,
        message: error.message || 'Failed to retrieve showtimes'
      });
    }
  };