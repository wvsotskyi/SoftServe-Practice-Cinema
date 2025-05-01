import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { HomePage } from "../pages/HomePage/HomePage";

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
    ],
  },
]);
