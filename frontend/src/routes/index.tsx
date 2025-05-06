import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";
import { MoviePage } from "../pages/MoviePage/MoviePage";
import { AddSession } from "../pages/AdminPage/AddSession";
import { AddMovie } from "../pages/AdminPage/AddMovie";
import { AdminLayout } from "../pages/AdminPage/AdminLayout";
import { Login } from "../pages/AuthPage/Login";
import { Register } from "../pages/AuthPage/Register";
import { AuthRoute } from "../components/Routes/AuthRoute";
import { AdminRoute } from "../components/Routes/AdminRoute";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "*",
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
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
      },
      {
        path: "/admin-add-movie",
        element: (
          <AdminRoute>
            <AddMovie />
          </AdminRoute>
        ),
      },
      {
        path: "/admin-add-session",
        element: (
          <AdminRoute>
            <AddSession />
          </AdminRoute>
        ),
      },
    ],
  },
]);