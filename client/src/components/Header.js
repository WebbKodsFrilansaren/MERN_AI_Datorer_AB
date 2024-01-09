import "../App.css";
import { useState, useEffect } from "react";

function Header() {
  // Some initial state that are false because we use fetch() to know what access we have
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Is logged in so menu shows?
  const [isAdmin, setIsAdmin] = useState(false); // Is admin so "Admin" item shows?
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Toggle Hamburger Menu when logged in
  const [accesses, setAccesses] = useState([""]); // store CRUD_components/CRUD_images here

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
      <nav className="mx-auto flex items-center justify-between">
        <a
          className="text-white text-sm lg:text-2xl font-bold ml-6 hover:text-cyan-500"
          href="/">
          AI DATORER AB Intranät
        </a>
        {isLoggedIn && (
          <ul
            className={`md:flex space-x-4 p-2 mr-4 ${
              isLoggedIn ? "flex" : "hidden"
            }`}>
            <li className="text-white cursor-pointer hover:underline font-bold">
              Start
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
              <button className="text-white cursor-pointer hover:underline font-bold">
                Logga ut
              </button>
            </li>
          </ul>
        )}
        {isLoggedIn && (
          <div className={`md:hidden mr-2`}>
            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
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
                  Start
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
                  <button className="block px-4 py-2 cursor-pointer hover:underline hover:bg-blue-100 font-bold">
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
