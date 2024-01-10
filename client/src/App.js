// Main Components
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

// Routing and router components
import { Route, Routes } from "react-router-dom";
import Login from "./router/Login";
import Register from "./router/Register";

// Global components thanks to useContext()
import AuthContext from "./middleware/AuthContext"; // useContext for:"aToken, setAToken"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Is logged in so menu shows?
  const [isAdmin, setIsAdmin] = useState(false); // Is admin so "Admin" item shows?
  const [accesses, setAccesses] = useState([]); // store CRUD_components/CRUD_images here
  const [aToken, setAToken] = useState(""); // Store access_token here in memory, NOT anywhere else!

  // This function grabs the received "atoken" from the child "Login.js" after successful login
  // and then stores it in memory in the state variable "RxNd4UC6C2KfNssrkAYa" which is then
  // used by axios for fetch making requests.
  const setAccessToken = (token) => {
    setAToken(token);
  };

  // Set login status = run this function when successfully logged in! (Login.js tells us)
  const setLoginSuccess = (bool) => {
    setIsLoggedIn(bool);
  };

  // Set admin status = if you are indeed "sysadmin" who logged in!
  const setAdmin = (bool) => {
    setIsAdmin(bool);
  };

  // RADERA NÄR KLAR:
  useEffect(() => {
    console.log("Värdet för isLoggedin: ", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    console.log("Värdet för aToken: ", aToken);
  }, [aToken]);

  useEffect(() => {
    console.log("Värdet för isAdmin: ", isAdmin);
  }, [isAdmin]);

  // State-based JSX
  return (
    <AuthContext.Provider value={{ aToken, setAToken }}>
      <div className="mx-auto">
        <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        <main className="mx-auto max-w-screen-xl p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Login
                  setAccessToken={setAccessToken}
                  setLoginSuccess={setLoginSuccess}
                  setAdmin={setAdmin}
                />
              }></Route>
            <Route path="/register" element={<Register />}></Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
