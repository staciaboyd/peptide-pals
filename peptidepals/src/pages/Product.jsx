
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h2>Peptide {id}</h2>

      {!user && <p>Please log in to purchase.</p>}
      {user && (
        <form method="POST" action="/.netlify/functions/create-checkout">
          <input type="hidden" name="peptide_id" value={id} />
          <select name="mg">
            <option value="5">5mg</option>
            <option value="10">10mg</option>
            <option value="15">15mg</option>
          </select>
          <select name="vials">
            <option value="1">1 Vial</option>
            <option value="5">5 Vials</option>
            <option value="10">10 Vials</option>
          </select>
          <button type="submit">Buy Now</button>
        </form>
      )}
    </div>
  );
}
