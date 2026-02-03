import { useAuth } from "../auth/AuthProvider";

export default function Account() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h2>Account</h2>
      <p>Email: {user?.email}</p>
    </div>
  );
}
