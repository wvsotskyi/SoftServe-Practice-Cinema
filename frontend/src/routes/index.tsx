import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";
import { MoviePage } from "../pages/MoviePage/MoviePage";
import Register from "../pages/AuthPage/Register";
import Login from "../pages/AuthPage/Login";
import AdminLayout from "../pages/AdminPage/AdminLayout";
import AddMovie from "../pages/AdminPage/AddMovie";
import AddSession from "../pages/AdminPage/AddSession";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path:"*",
        element: <h1>Page not found</h1>
      },
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <MoviePage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/admin",
        element: <AdminLayout/>,
      },
      {
        path: "/admin-add-movie",
        element: <AddMovie/>,
      },
      {
        path: "/admin-add-session",
        element: <AddSession/>,
      },

    ],
  },
]);
