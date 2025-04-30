import { Link, useLocation } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
}

interface NavBarProps {
  navItems: NavItem[];
}

export function Navbar({ navItems }: NavBarProps) {
  const location = useLocation();

  const getActiveTab = () => {
    const currentItem = navItems.find(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/" && location.pathname.startsWith(item.path))
    );
    return currentItem?.name || navItems[0]?.name;
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-gray-800/70 backdrop-blur-sm shadow-md">
      <div className="flex items-center">
        <img src="/svg/logo.svg" alt="LUMIX" className="h-10 p-0 mr-36" />

        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium ${
                getActiveTab() === item.name ? "text-red-400" : "text-white"
              } hover:text-red-300 transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-white hover:text-gray-300">
          <img
            src="/svg/search.svg"
            alt="Search"
            className="h-5 w-5 brightness-0 invert"
          />
        </button>
        <button className="text-white hover:text-gray-300">
          <img
            src="/svg/bell.svg"
            alt="Notifications"
            className="h-5 w-5 brightness-0 invert"
          />
        </button>
        <button className="text-white hover:text-gray-300">
          <img
            src="/svg/user.svg"
            alt="Profile"
            className="h-5 w-5 brightness-0 invert"
          />
        </button>
      </div>
    </nav>
  );
}
