
import { supabase } from "../lib/supabase";

export default function Account() {
  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  );
}
