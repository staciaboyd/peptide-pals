import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";

const ADMIN_EMAIL = "you@example.com"; // ← CHANGE THIS

export default function AdminRoute({ children }) {
  const [ok, setOk] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setOk(data?.user?.email === ADMIN_EMAIL);
    });
  }, []);

  if (ok === null) return null;
  return ok ? children : <Navigate to="/" replace />;
}
