// Main Components
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

// Routing and router components
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./router/Login";
import Register from "./router/Register";
import Start from "./router/Start";
import NotFound from "./router/NotFound";
import Products from "./router/Products";
import Product from "./router/Product";
import EditProduct from "./router/EditProduct";
import AddProduct from "./router/AddProduct";

// Global components thanks to useContext()
import AuthContext from "./middleware/AuthContext"; // useContext for:"aToken, setAToken, accesses & isAdmin & isLoggedIn"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Is logged in so menu shows?
  const [isAdmin, setIsAdmin] = useState(false); // Is admin so "Admin" item shows?
  const [accesses, setAccesses] = useState([]); // store CRUD_components/CRUD_images here
  const [aToken, setAToken] = useState(""); // Store access_token here in memory, NOT anywhere else!

  // This function grabs the received "atoken" from the child "Login.js" after successful login and then
  // stores it in memory in the state variable "aToken" which is then used by axios for fetch making requests.
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

  // Set accesses received after login (Login.js tells us)
  const setAccess = (accessArr) => {
    setAccesses(accessArr);
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

  useEffect(() => {
    console.log("Värdet för accesses: ", accesses);
  }, [accesses]);

  // State-based JSX
  return (
    <AuthContext.Provider
      value={{
        aToken,
        setAToken,
        isAdmin,
        isLoggedIn,
        setIsAdmin,
        setIsLoggedIn,
        accesses,
        setAccesses,
      }}>
      <div className="mx-auto">
        <Header
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          setAccessToken={setAccessToken}
          setLoginSuccess={setLoginSuccess}
          setAdmin={setAdmin}
        />
        <main className="mx-auto max-w-screen-xl p-4">
          <Routes>
            {/* PUBLIC ROUTES = NO ACCESS_TOKEN NEEDED TO USE THEM!! */}
            <Route
              path="/login"
              element={
                <Login
                  setAccessToken={setAccessToken}
                  setAccess={setAccess}
                  setLoginSuccess={setLoginSuccess}
                  setAdmin={setAdmin}
                />
              }></Route>
            <Route path="/register" element={<Register />}></Route>

            {/* PRIVATE ROUTES = NEED VALID ACCESS_TOKEN OT USE THEM! */}
            <Route path="/" element={<Start isLoggedIn={isLoggedIn} />}></Route>
            <Route
              path="/products"
              element={<Products isLoggedIn={isLoggedIn} />}></Route>
            <Route
              path="/products/:id"
              element={<Product isLoggedIn={isLoggedIn} />}></Route>
            <Route
              path="/products/:id/edit"
              element={<EditProduct isLoggedIn={isLoggedIn} />}></Route>
            <Route
              path="/products/add"
              element={<AddProduct isLoggedIn={isLoggedIn} />}></Route>

            {/* CATCH ANY INVALID ROUTE!! */}
            <Route path="/*" element={<NotFound />}></Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
