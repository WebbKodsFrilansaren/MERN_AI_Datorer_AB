import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import axios from "../middleware/axios";

// First letter always uppercase!
function Products() {
  const [state1, setState1] = useState(null);
  const [state2, setState2] = useState(null);
  const [state3, setState3] = useState(null);

  useEffect(() => {
    // Init

    // Cleanup
    return () => {};
  }, []);
  return <div>Produkter</div>;
}

export default Products; // First letter always uppercase!
