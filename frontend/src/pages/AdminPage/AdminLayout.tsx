import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaPlus, FaVideo } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-[#FECACA] text-black p-2 rounded flex items-center gap-2"
      : "text-white hover:text-red-400 p-2 rounded flex items-center gap-2";

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col sm:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden sm:block w-64 bg-[#1C1B20] p-6">
        <nav className="flex flex-col gap-4 text-sm">
          <NavLink to="/admin" end className={linkStyle}>
            <FaHome /> Головна
          </NavLink>
          <NavLink to="/admin/add-movie" className={linkStyle}>
            <FaPlus /> Додати фільм
          </NavLink>
          <NavLink to="/admin/add-session" className={linkStyle}>
            <FaVideo /> Додати сеанс
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-left text-white hover:text-red-400 p-2 rounded flex items-center gap-2"
          >
            <FiLogOut /> Вийти
          </button>
        </nav>
      </aside>

      {/* Mobile Navigation */}
      <div className="sm:hidden p-4 bg-[#1C1B20] sticky top-16 z-10">
        <div className="grid grid-cols-2 gap-4">
          <NavLink to="/admin" end className={linkStyle}>
            <FaHome /> Головна
          </NavLink>
          <NavLink to="/admin/add-movie" className={linkStyle}>
            <FaPlus /> Додати фільм
          </NavLink>
          <NavLink to="/admin/add-session" className={linkStyle}>
            <FaVideo /> Додати сеанс
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-white hover:text-red-400 p-2 rounded flex items-center gap-2 justify-center bg-[#27272a]"
          >
            <FiLogOut /> Вийти
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
