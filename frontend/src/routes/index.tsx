import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";
import { MoviePage } from "../pages/MoviePage/MoviePage";
import { FavoritesPage } from "../pages/FavoritesPage/FavoritesPage";
import { AddSession } from "../pages/AdminPage/AddSession";
import AddMovie from "../pages/AdminPage/AddMovie";
import { AdminLayout } from "../pages/AdminPage/AdminLayout";
import { AdminHome } from "../pages/AdminPage/AdminHome";
import { Login } from "../pages/AuthPage/Login";
import { Register } from "../pages/AuthPage/Register";
import { AuthRoute } from "../components/Routes/AuthRoute";
import { AdminRoute } from "../components/Routes/AdminRoute";
import EditMovie from "../pages/AdminPage/EditMovie";
import { ProtectedRoute } from "../components/Routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "*",
        element: <h1>Page not found</h1>,
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
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
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
        children: [
          {
            path: "",
            element: <AdminHome />,
          },
          {
            path: "add-movie",
            element: <AddMovie />,
          },
          {
            path: "add-session",
            element: <AddSession />,
          },
          {
            path: "edit-movie",
            element: <EditMovie />,
          },
        ],
      },
    ],
  },
]);
