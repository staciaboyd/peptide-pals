import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import AdminPricing from "./pages/AdminPricing";
import AdminRoute from "./components/AdminRoute";
import Success from "./pages/Success";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/success" element={<Success />} />
        <Route
          path="/admin/pricing"
          element={
            <AdminRoute>
              <AdminPricing />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
