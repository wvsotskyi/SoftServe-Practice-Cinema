import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mobileNavLinks = (
    <div className="flex flex-col gap-4 px-6 py-4 bg-[#1C1B20]">
      <NavLink to="/" onClick={() => setIsOpen(false)} className="text-white hover:text-red-600">Головна</NavLink>
      <NavLink to="/now-showing" onClick={() => setIsOpen(false)} className="text-white hover:text-red-600">Зараз в кіно</NavLink>
      <NavLink to="/favorites" onClick={() => setIsOpen(false)} className="text-white hover:text-red-600">Обране</NavLink>
      <NavLink to="/sessions" onClick={() => setIsOpen(false)} className="text-white hover:text-red-600">Сеанси</NavLink>
      {user?.role === "ADMIN" && (
        <NavLink to="/admin" onClick={() => setIsOpen(false)} className="text-white hover:text-[#FF4500]">Адмін</NavLink>
      )}
      {user ? (
        <button 
          onClick={() => {
            setIsOpen(false);
            handleLogout();
          }}
          className="text-white hover:text-red-600 text-left flex items-center gap-2"
          disabled={isLoading}
        >
          <FaSignOutAlt /> Вийти
        </button>
      ) : (
        <NavLink to="/login" onClick={() => setIsOpen(false)} className="text-white hover:text-red-600">Увійти</NavLink>
      )}
    </div>
  );

  return (
    <div className="bg-[#1E1E1E] shadow-md top-0 z-20">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link to="/">
          <img
            src="svg/logo.svg"
            alt="logo"
            className="w-40 h-12 object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center">
          <div className="flex gap-6 ml-10">
            <NavLink
              to="/"
              className="text-white hover:text-red-600 transition-all no-underline"
            >
              Головна
            </NavLink>
            <NavLink
              to="/now-showing"
              className="text-white hover:text-red-600 transition-all no-underline"
            >
              Зараз в кіно
            </NavLink>
            <NavLink
              to="/favorites"
              className="text-white hover:text-red-600 transition-all no-underline"
            >
              Обране
            </NavLink>
            <NavLink
              to="/sessions"
              className="text-white hover:text-red-600 transition-all no-underline"
            >
              Сеанси
            </NavLink>
          </div>

          {user?.role === "ADMIN" && (
            <div className="ml-6">
              <NavLink
                to="/admin"
                className="text-white hover:text-[#FF4500] transition-all no-underline"
              >
                Адмін
              </NavLink>
            </div>
          )}
        </div>

        <div className="flex gap-6 items-center ml-auto">
          <div className="text-white cursor-pointer hover:text-red-600 transition-all">
            <FaSearch size={20} />
          </div>
          <div className="text-white cursor-pointer hover:text-red-600 transition-all hidden sm:inline">
            <FaBell size={20} />
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-white hidden sm:inline">{user.name || user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-white hover:text-red-600 transition-all flex items-center gap-1"
                disabled={isLoading}
              >
                <FaSignOutAlt size={20} />
                <span className="hidden sm:inline">Вийти</span>
              </button>
            </div>
          ) : (
            <div className="text-white cursor-pointer hover:text-red-600 transition-all">
              <NavLink to="/login">
                <CgUser size={24} />
              </NavLink>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          {mobileNavLinks}
        </div>
      )}
    </div>
  );
}