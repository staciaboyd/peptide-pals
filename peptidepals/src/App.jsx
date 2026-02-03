
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Success from "./pages/Success";
import Account from "./pages/Account";
import { AuthProvider } from "./auth/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/account" element={<Account />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </AuthProvider>
  );
}
