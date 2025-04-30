import css from "./MovieRating.module.css";

interface MovieRatingProps {
  voteAverage: number;
}

function MovieRating({ voteAverage }: MovieRatingProps) {
  return (
    <div className={css["movie-rating"]}>
      <div className={css["movie-rating-wrapper"]}>
        <img
          src={`${import.meta.env.VITE_PUBLIC_URL}/svg/rating.svg`}
          alt="rating"
          className={css["movie-rating-base"]}
        />
        <div
          className={css["movie-rating-red-overlay"]}
          style={{ width: `${voteAverage * 10}%` }}
        >
          <img
            src={`${import.meta.env.VITE_PUBLIC_URL}/svg/rating-red.svg`}
            alt="rating-red"
          />
        </div>
      </div>
      <span className={css["movie-rating-layer-num"]}>
        {voteAverage.toFixed(1)}
      </span>
    </div>
  );
};

export default MovieRating;
