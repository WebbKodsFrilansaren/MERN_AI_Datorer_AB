import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Is logged in so menu shows?
  const [isAdmin, setIsAdmin] = useState(false); // Is admin so "Admin" item shows?
  const [accesses, setAccesses] = useState([""]); // store CRUD_components/CRUD_images here

  return (
    <div className="mx-auto">
      <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
      <main className="mx-auto max-w-screen-xl p-4">Placera router här</main>
      <Footer />
    </div>
  );
}

export default App;
