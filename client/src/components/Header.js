import "../App.css";
import { useState, useEffect } from "react";

function Header() {
  // Some initial state that are false because we use fetch() to know what access we have
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const menuBtn = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    const handleClick = (e) => {
      if (e.target.matches("a") && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    const handleOutsideClick = (e) => {
      if (showMobileMenu && !e.target.matches("#mobile-menu")) {
        setShowMobileMenu(false);
      }
    };

    menuBtn.addEventListener("click", () => {
      setShowMobileMenu((prev) => !prev);
    });

    mobileMenu.addEventListener("click", handleClick);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Cleanup: remove event listeners when the component unmounts
      menuBtn.removeEventListener("click", () => {});
      mobileMenu.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleOutsideClick);
    };
  });

  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
      <nav className="mx-auto flex items-center justify-between">
        <a
          className="text-white text-sm lg:text-2xl font-bold ml-6 hover:text-cyan-500"
          href="/">
          AI DATORER AB Intranät
        </a>
        <ul
          className={`md:flex space-x-4 p-2 mr-4 ${
            isLoggedIn ? "" : "hidden"
          }`}>
          <li className="text-white hover:underline font-bold">Start</li>
          {isAdmin && (
            <li className="text-white hover:underline font-bold">Admin</li>
          )}
          <li className="text-white hover:underline font-bold">Produkter</li>
          <li>
            <button className="text-white hover:underline font-bold">
              Logga ut
            </button>
          </li>
        </ul>
        <div className={`md:hidden mr-2`}>
          <button
            onClick={() => setShowMobileMenu((prev) => !prev)}
            id="mobile-menu-button"
            className="text-white p-2 focus:outline-none">
            <span className="block w-7 h-1 bg-white mb-1"></span>
            <span className="block w-7 h-1 bg-white mb-1"></span>
            <span className="block w-7 h-1 bg-white"></span>
          </button>
          <ul
            className={`${
              showMobileMenu ? "block" : "hidden"
            } absolute top-14 right-1 mt-2 bg-white text-gray-800 border rounded-md`}
            id="mobile-menu">
            <li className="block px-4 py-2 hover:underline hover:bg-blue-100 font-bold">
              Start
            </li>
            {isAdmin && (
              <li className="block px-4 py-2 hover:underline hover:bg-blue-100 font-bold">
                Admin
              </li>
            )}
            <li className="block px-4 py-2 hover:underline hover:bg-blue-100 font-bold">
              Produkter
            </li>
            <li>
              <button className="block px-4 py-2 hover:underline hover:bg-blue-100 font-bold">
                Logga ut
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
