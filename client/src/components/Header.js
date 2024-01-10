import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import ModalLogout from "./ModalLogout";
import axios from "../middleware/axios";

function Header({
  isLoggedIn,
  isAdmin,
  setAccessToken,
  setLoginSuccess,
  setAdmin,
}) {
  // Current access_token value when navigating here!
  const { aToken, setAToken } = useContext(AuthContext);

  // Navigate and redirect user with this!
  const navigate = useNavigate();
  // Some initial state that are false because we use fetch() to know what access we have
  // "isLoggedIn" = shows <nav> or not | "isAdmin" = shows "Admin" link in <nav> when visible or not
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Toggle Hamburger Menu when logged in
  const [isModalLogoutOpen, setModalLogoutOpen] = useState(false); // Logout modal

  // Cancel logout modal
  const logoutClick = () => {
    setModalLogoutOpen(true);
  };

  // Cancel logout modal
  const cancelLogout = () => {
    setModalLogoutOpen(false);
  };

  // Handle logout when clicked on "Ja"
  const confirmLogoutClick = async () => {
    try {
      const res = await axios.post("/logout", "", {
        withCredentials: true,
        validateStatus: () => true,
      });
      // When failed logging out
      if (res.status !== 200) {
        alert('Serversvar: "' + res.data.error + '"');
      } // When succeeded logging out
      else {
        setModalLogoutOpen(false);
        setAccessToken("");
        setAdmin(false);
        setLoginSuccess(false);
        navigate("/login");
      }
    } catch (e) {
      alert("Kontakta Webbutvecklaren för klienthjälp. Bugg!");
    }
  };

  // useEffect for handling hamburger menu
  useEffect(() => {
    // We should NOT use direct DOM Manip so instead we listen for click and just match
    const handleClick = (e) => {
      if (e.target.matches("a") && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    // When we click outside of the menu and it is TRUE that menu is showing
    const handleOutsideClick = (e) => {
      if (showMobileMenu && !e.target.matches("#mobile-menu-button")) {
        setShowMobileMenu(false);
      }
    };

    // Start listening again for new clicks
    document.addEventListener("click", handleClick);
    document.addEventListener("click", handleOutsideClick);

    // Remove listeners when component is removed/unmounted
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showMobileMenu]); // Run this useEffect any time this value changes!

  return (
    <header className="bg-gray-800 p-4 d-flex justify-between items-center sticky w-full top-0 z-50">
      <ModalLogout
        isOpen={isModalLogoutOpen}
        onCancel={cancelLogout}
        onConfirm={confirmLogoutClick}
      />
      <nav className="mx-auto flex items-center justify-between">
        <p className="text-white text-sm lg:text-2xl cursor-pointer font-bold ml-6 hover:text-cyan-500">
          <Link to="/">AI DATORER AB Intranät</Link>
        </p>
        {isLoggedIn && (
          <ul className={`hidden md:flex space-x-4 p-2 mr-4`}>
            <li className="text-white cursor-pointer hover:underline font-bold">
              <Link to="/">Start</Link>
            </li>
            {isAdmin && (
              <li className="text-white cursor-pointer hover:underline font-bold">
                Admin
              </li>
            )}
            <li className="text-white cursor-pointer hover:underline font-bold">
              Produkter
            </li>
            <li>
              <button
                onClick={logoutClick}
                className="text-white cursor-pointer hover:underline font-bold">
                Logga ut
              </button>
            </li>
          </ul>
        )}
        {isLoggedIn && (
          <div
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="md:hidden mr-2">
            <button
              id="mobile-menu-button"
              className="text-white p-2 focus:outline-none">
              <span className="block w-7 h-1 bg-white mb-1"></span>
              <span className="block w-7 h-1 bg-white mb-1"></span>
              <span className="block w-7 h-1 bg-white"></span>
            </button>
            {showMobileMenu && (
              <ul
                className={`${
                  showMobileMenu ? "block" : "hidden"
                } absolute top-14 right-1 mt-2 bg-white text-gray-800 border rounded-md`}
                id="mobile-menu">
                <li className="block px-4 py-2 cursor-pointer hover:underline hover:bg-blue-100 font-bold">
                  <Link to="/">Start</Link>
                </li>
                {isAdmin && (
                  <li className="block px-4 py-2 cursor-pointer hover:underline hover:bg-blue-100 font-bold">
                    Admin
                  </li>
                )}
                <li className="block px-4 py-2 cursor-pointer hover:underline hover:bg-blue-100 font-bold">
                  Produkter
                </li>
                <li>
                  <button
                    onClick={logoutClick}
                    className="block px-4 py-2 cursor-pointer hover:underline hover:bg-blue-100 font-bold">
                    Logga ut
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
