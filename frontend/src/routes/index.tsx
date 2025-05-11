import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";
import { MoviePage } from "../pages/MoviePage/MoviePage";
import { SearchPage } from "../pages/SearchPage/SearchPage";
import { FavoritesPage } from "../pages/FavoritesPage/FavoritesPage";
import { AddSession } from "../pages/AdminPage/AddSession";
import { AdminLayout } from "../pages/AdminPage/AdminLayout";
import { AdminHome } from "../pages/AdminPage/AdminHome";
import { LoginPage } from "../pages/AuthPage/LoginPage";
import { RegisterPage } from "../pages/AuthPage/RegisterPage";
import { AuthRoute } from "../components/Routes/AuthRoute";
import { AdminRoute } from "../components/Routes/AdminRoute";
import { ProtectedRoute } from "../components/Routes/ProtectedRoute";
import { EditMovie } from "../pages/AdminPage/EditMovie";
import { AddMovie } from "../pages/AdminPage/AddMovie";
import { Session } from "../pages/Session/Session";
import { Booking } from "../pages/Booking/Booking";

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
        path:"search",
        element: <SearchPage />,
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
            <RegisterPage />
          </AuthRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthRoute>
            <LoginPage />
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
      {
        path: "/sessions",
        element: <Session />,
      },
      {
        path: "/booking/:showtimeId",
        element: <Booking />,
      },
    ],
  },
]);
