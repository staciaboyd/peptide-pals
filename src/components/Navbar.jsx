import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <nav style={{ padding: 20, borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: 20 }}>
        <strong>PeptidePals</strong>
      </Link>

      {user ? (
        <>
          <Link to="/account" style={{ marginRight: 20 }}>
            Account
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 20 }}>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
