
import { Link } from "react-router-dom";

const peptides = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Peptide ${i + 1}`
}));

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>PeptidePals</h1>
      {peptides.map(p => (
        <div key={p.id}>
          <Link to={`/product/${p.id}`}>{p.name}</Link>
        </div>
      ))}
      <p>Research Use Only. Not for human consumption.</p>
    </div>
  );
}
