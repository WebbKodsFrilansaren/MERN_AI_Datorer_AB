import "../App.css";
import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000/api";

function Start() {
  // Current access_token value when navigating here!
  const { aToken } = useContext(AuthContext);

  // Navigate and redirect user with this!
  const navigate = useNavigate();

  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!aToken.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
      navigate("/login");
    }
  });

  // First letter always uppercase!
  const [state1, setState1] = useState("");
  const [state2, setState2] = useState("");
  const [state3, setState3] = useState("");

  return <div>STARTSIDAN!</div>;
}

export default Start; // First letter always uppercase!
