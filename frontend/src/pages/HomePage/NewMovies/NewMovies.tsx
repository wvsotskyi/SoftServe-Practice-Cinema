import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MovieRating from "../../../components/MovieRating/MovieRating";
import { MovieWithRelations } from "../../../types/prisma";
import css from "./NewMovies.module.css";

function NewMovies() {
  const [newMovies, setNewMovies] = useState<MovieWithRelations[]>([]);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const scrollQueue = useRef<number[]>([]);
  const isProcessingScroll = useRef(false);
  const targetScrollLeft = useRef<number | null>(null);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const loadNewMovies = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/movies`
      );
      const movies = response.data.data.slice(0, 25);
      setNewMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNewMovies();
  }, []);

  const processScrollQueue = () => {
    const carousel = carouselRef.current;
    if (
      !carousel ||
      isProcessingScroll.current ||
      scrollQueue.current.length === 0
    )
      return;

    isProcessingScroll.current = true;
    const amount = scrollQueue.current.shift()!;
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    let newScrollLeft = carousel.scrollLeft + amount;

    if (newScrollLeft < 0) newScrollLeft = 0;
    if (newScrollLeft > maxScrollLeft) newScrollLeft = maxScrollLeft;

    const onScroll = () => {
      const diff = Math.abs(carousel.scrollLeft - newScrollLeft);
      if (diff < 5) {
        carousel.removeEventListener("scroll", onScroll);
        isProcessingScroll.current = false;
        targetScrollLeft.current = null;
        setIsAtStart(carousel.scrollLeft <= 50);
        setIsAtEnd(carousel.scrollLeft >= maxScrollLeft - 50);
        setTimeout(() => processScrollQueue(), 100);
      }
    };

    targetScrollLeft.current = newScrollLeft;
    carousel.addEventListener("scroll", onScroll);
    carousel.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const scrollByAmount = (amount: number) => {
    if (scrollQueue.current.length > 0) return;
    scrollQueue.current.push(amount);
    processScrollQueue();
  };

  const scrollLeft = () => scrollByAmount(-window.innerWidth);
  const scrollRight = () => scrollByAmount(window.innerWidth);

  const handleClick = (id: number) => {
    setClickedId(id);
    setTimeout(() => setClickedId(null), 300);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className={css["carousel-container-mobile"]}>
        <div className={css["carousel-mobile"]}>
          {newMovies.map((movie) => (
            <Link to={`/movie-details/${movie.id}`} key={movie.id}>
              <div className={css["carousel-item-mobile"]}>
                <img
                  src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/original${
                    movie.backdropPath
                  }`}
                  alt={movie.title}
                  className={css["carousel-image-mobile"]}
                />
                <div className={css["image-overlay-mobile"]}></div>
                <p className={css["movie-title-mobile"]}>{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={css["carousel-container"]}>
      {newMovies.length !== 0 && (
        <button
          className={`${css["carousel-button"]} ${css["left"]} ${
            isAtStart ? css["hidden"] : ""
          }`}
          onClick={scrollLeft}
        >
          <img
            src={`${import.meta.env.VITE_PUBLIC_URL}/svg/chevron-left.svg`}
            alt="left"
          />
        </button>
      )}
      <div className={css["carousel"]} ref={carouselRef}>
        {newMovies.map((movie) => (
          <div
            key={movie.id}
            className={`${css["carousel-item"]} ${
              clickedId === movie.id ? css["clicked"] : ""
            }`}
            onClick={() => handleClick(movie.id)}
          >
            <div className={css["image-wrapper"]}>
              <img
                src={`${import.meta.env.VITE_TMDB_IMAGE_URL}/original${
                  movie.backdropPath
                }`}
                alt={movie.title}
                className={css["carousel-image"]}
              />
              <div className={css["image-overlay"]}></div>
            </div>
            <div className={css["carousel-content"]}>
              <div className={css["carousel-left"]}>
                <div className={css["carousel-left-top"]}>
                  <h1 className={css["movie-title"]}>{movie.title}</h1>
                  {movie.voteAverage && movie.voteAverage > 0 && (
                    <MovieRating voteAverage={movie.voteAverage} />
                  )}
                </div>
                <div className={css["carousel-left-bottom"]}>
                  {movie.runtime && movie.runtime > 0 && (
                    <p className={css["movie-duration"]}>
                      {Math.floor(movie.runtime / 60) > 0 &&
                      movie.runtime % 60 === 0
                        ? `${Math.floor(movie.runtime / 60)}г.`
                        : Math.floor(movie.runtime / 60) === 0 &&
                          movie.runtime % 60 > 0
                        ? `${movie.runtime % 60}хв.`
                        : `${Math.floor(movie.runtime / 60)}г.${
                            movie.runtime % 60
                          }хв.`}
                    </p>
                  )}
                  <p className={css["movie-description"]}>
                    {movie.overview || ""}
                  </p>
                  <p className={css["movie-language"]}>
                    <span className={css["label"]}>Мова: </span>українська
                  </p>
                  <p className={css["movie-genres"]}>
                    <span className={css["label"]}>Жанр: </span>
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </p>
                  <p className={css["movie-production"]}>
                    <span className={css["label"]}>Виробництво: </span>США
                  </p>
                  <button className={css["trailer-button"]}>
                    <img
                      src={`${import.meta.env.VITE_PUBLIC_URL}/svg/play.svg`}
                      alt="play"
                    />
                    ТРЕЙЛЕР
                  </button>
                  <Link
                    to={`movie-sessions/${movie.id}`}
                    className={css["buy-ticket-button"]}
                  >
                    Придбати квитки
                  </Link>
                </div>
              </div>
              <div className={css["carousel-right"]}>
                <Link to={`/movie-details/${movie.id}`}>
                  <button className={css["details-button"]}>
                    <div className={css["arrow-circle"]}>
                      <img
                        src={`${
                          import.meta.env.VITE_PUBLIC_URL
                        }/svg/arrow-right.svg`}
                        alt="arrow-right"
                      />
                    </div>
                    <span className={css["details-text"]}>ДЕТАЛЬНІШЕ</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {newMovies.length !== 0 && (
        <button
          className={`${css["carousel-button"]} ${css["right"]} ${
            isAtEnd ? css["hidden"] : ""
          }`}
          onClick={scrollRight}
        >
          <img
            src={`${import.meta.env.VITE_PUBLIC_URL}/svg/chevron-right.svg`}
            alt="right"
          />
        </button>
      )}
    </div>
  );
}

export default NewMovies;
