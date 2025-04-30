import { useEffect, useState } from "react";
import { MovieWithRelations } from "../../types/prisma";
import css from "./MovieTrailer.module.css";

interface MovieTrailerProps {
  movie: MovieWithRelations;
  closeTrailer: () => void;
}

export function MovieTrailer({ movie, closeTrailer }: MovieTrailerProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const width = isMobile ? 320 : 640;
  const height = isMobile ? 180 : 360;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).classList.contains(css["trailer-overlay-wrap"]) ||
      (e.target as HTMLElement).classList.contains(css["trailer-holder"])
    ) {
      closeTrailer();
    }
  };

  return (
    <div className={css["trailer-overlay-wrap"]} onClick={handleOverlayClick}>
      <div className={css["trailer-holder"]}>
        <div
          className={css["trailer-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={css["trailer-player"]}>
            <iframe
              width={width}
              height={height}
              src={`https://www.youtube.com/embed/${movie.trailerKey}?showinfo=0&autoplay=1`}
              frameBorder="0"
              title="YouTube video player"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className={css["trailer-title"]}>
            «{movie.title}»{" "}
            <small>
              (оригінальна назва: "{movie.originalTitle}",{" "}
                {movie.releaseDate ? String(movie.releaseDate).split("-")[0] : ""})
            </small>
          </div>
          <div className={css["trailer-description"]}>{movie.overview}</div>
        </div>
      </div>
      <button
        type="button"
        className={css["trailer-close"]}
        title="Закрити"
        onClick={closeTrailer}
      >
        <img
          src={`${import.meta.env.VITE_PUBLIC_URL}/svg/x-heading.svg`}
          alt="close"
        />
      </button>
    </div>
  );
}