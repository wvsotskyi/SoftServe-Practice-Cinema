import { Outlet } from "react-router-dom";
import { Navbar } from "./NavBar";

export function MainLayout() {
  return (
    <div className="app">
      <header>
        <Navbar></Navbar>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
