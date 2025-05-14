import { Link } from "react-router-dom";
import { FavoriteButton } from "../FavoriteButton/FavoriteButton";
import { MovieWithRelations } from "../../types/prisma";
import css from "./MovieCard.module.css";

export function MovieCard({ movie }: { movie: MovieWithRelations }) {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className={css["movie-card"]}>
        <div className={css["movie-card__image"]}>
          <div className={css["movie-card__overlay"]}></div>
          <img src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/w500${movie.posterPath}`} alt={movie.title} />
        </div>
        <div className={css["movie-card__info"]}>
          <div className={css["movie-card__title-row"]}>
            <h3>{movie.title}</h3>
            <FavoriteButton movie={movie} showText={false} />
          </div>
          <p>{movie.releaseDate ? String(movie.releaseDate).split("-")[0] : ""}</p>
        </div>
      </div>
    </Link>
  );
}
