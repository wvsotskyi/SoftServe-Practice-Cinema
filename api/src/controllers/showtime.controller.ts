import { createShowtime, deleteShowtime, getShowtime, getShowtimeFilterOptions, getShowtimesWithFilters, updateShowtime } from '@services/showtime.service.js';
import { Request, Response } from 'express';

export async function getFiltersController(req: Request, res: Response) {
  const filters = await getShowtimeFilterOptions();
  res.json(filters);
}

export async function getShowtimeByIdController(req: Request, res: Response) {
  const showtimeId = Number(req.params.id);

  const showtime = await getShowtime(showtimeId);

  res.json(showtime);
}

export async function getFilteredShowtimesController(req: Request, res: Response) {
  const { genreId, date, time } = req.query;

  const dates = date
    ? (date as string).split(',').map((d) => d.trim())
    : undefined;

  const times = time
    ? (time as string).split(',').map((t) => t.trim())
    : undefined;

  const showtimes = await getShowtimesWithFilters({
    genreId: genreId ? Number(genreId) : undefined,
    dates,
    times,
  });

  res.json(showtimes);
}

export async function createShowtimeController(req: Request, res: Response) {
  const { movieId, hallId, date, time, price } = req.body;

  const newShowtime = await createShowtime({
    movieId,
    hallId,
    date,
    time,
    price,
  });

  res.status(201).json(newShowtime);
}

export async function updateShowtimeController(req: Request, res: Response) {
  const showtimeId = Number(req.params.id);
  const { movieId, hallId, date, time, price } = req.body;

  const updatedShowtime = await updateShowtime(showtimeId, {
    movieId,
    hallId,
    date,
    time,
    price,
  });

  res.json(updatedShowtime);
}

export async function deleteShowtimeController(req: Request, res: Response) {
  const showtimeId = Number(req.params.id);
  await deleteShowtime(showtimeId);
  res.status(204).send();
}