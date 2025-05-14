import css from "./HomePage.module.css";
import { NewMovies } from "./NewMovies/NewMovies";

export function HomePage() {
  return (
    <div className={css["main-app"]}>
      <NewMovies />
    </div>
  );
}
