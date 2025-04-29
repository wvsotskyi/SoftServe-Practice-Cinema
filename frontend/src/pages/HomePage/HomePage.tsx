import NewMovies from "./NewMovies/NewMovies";
import css from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={css["main-app"]}>
      <NewMovies />
    </div>
  );
}

export default HomePage;
