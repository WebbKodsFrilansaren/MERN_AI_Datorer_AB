import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import axios from "../middleware/axios";
const IMGURL = "http://localhost:5000/images";

// First letter always uppercase!
function EditProduct({ isLoggedIn }) {
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  // Current access_token value when navigating here!
  const { aToken } = useContext(AuthContext);
  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });
  const goBack = () => {
    navigate(-1);
  };
  const [state1, setState1] = useState(null);
  const [state2, setState2] = useState(null);
  const [state3, setState3] = useState(null);

  useEffect(() => {
    // Init

    // Cleanup
    return () => {};
  }, []);
  return <></>;
}

export default EditProduct; // First letter always uppercase!
