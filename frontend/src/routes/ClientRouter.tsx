import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";

function ClientRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<p>404</p>} />
      </Routes>
    </>
  );
}

export default ClientRouter;
