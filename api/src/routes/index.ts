import { Router } from "express";
import movieRoutes from "./movie.routes.js";
import authRoutes from "./auth.routes.js";
import bookingRoutes from "./booking.routes.js";
import favoriteRoutes from "./favorite.routes.js";
import genreRoutes from "./genre.routes.js";
import showtimeRoutes from "./showtime.routes.js";
import hallRoutes from "./hall.routes.js";
import tmdbRoutes from "./tmdb.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use("/movies", movieRoutes);
router.use('/bookings', bookingRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/genres', genreRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/halls', hallRoutes);
router.use('/tmdb', tmdbRoutes);

export const initializeRoutes = (app: any) => {
  app.use("/api", router);
};