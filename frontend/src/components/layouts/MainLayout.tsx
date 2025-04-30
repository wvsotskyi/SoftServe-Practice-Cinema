import { Outlet } from "react-router-dom";
import { Navbar } from "./NavBar";

export function MainLayout() {
  const navItems = [
    { name: "Головна", path: "/" },
    { name: "Сеанси", path: "/sessions" },
    // { name: "Обране", path: "/favorites" },
  ];

  return (
    <div className="app">
      <header>
        <Navbar navItems={navItems}></Navbar>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
