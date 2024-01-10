import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";

function Register() {
  const { aToken, setAToken } = useContext(AuthContext);

  // First letter always uppercase!
  const [registerBody, setRegsiterBody] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerOkMsg, setRegisterOkMsg] = useState("");
  const [errorMsgs, setErrMsgs] = useState({
    errUsername: "",
    errFullname: "",
    errEmail: "",
    errPassword: "",
    errPassword2: "",
    errRegister: "",
  });

  useEffect(() => {
    // Init
    console.log("Register säger att aToken är: ", aToken);
    // Cleanup
    return () => {};
  });
  return (
    <div class="container mx-auto p-4 min-h-screen">
      <div class="flex justify-center">
        <div class="bg-white rounded-lg p-6 shadow-md w-full md:w-1/2 lg:w-1/3">
          <h2 class="text-2xl font-semibold mb-4">Registrering</h2>
          <form>
            <div class="mb-4">
              <label
                for="fullname"
                class="block text-sm font-medium text-gray-600">
                Fullständigt namn
              </label>
              <input
                id="fullname"
                type="text"
                name="fullname"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errFullname}</p>
            </div>
            <div class="mb-4">
              <label
                for="username"
                class="block text-sm font-medium text-gray-600">
                Användarnamn
              </label>
              <input
                id="username"
                type="text"
                name="username"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errUsername}</p>
            </div>
            <div class="mb-4">
              <label
                for="email"
                class="block text-sm font-medium text-gray-600">
                E-post
              </label>
              <input
                id="email"
                type="email"
                name="email"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errEmail}</p>
            </div>
            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-600">
                Lösenord
              </label>
              <input
                id="password"
                type="password"
                name="password"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errPassword}</p>
            </div>
            <div class="mb-4">
              <label
                for="password2"
                class="block text-sm font-medium text-gray-600">
                Upprepa lösenord
              </label>
              <input
                id="password2"
                type="password"
                name="password2"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errPassword2}</p>
            </div>
            <div>
              <button
                type="submit"
                class="w-full bg-gray-500 text-white font-bold p-2 rounded-md hover:bg-gray-600">
                Registrera
              </button>
              <p class="text-red-500 font-bold">{errorMsgs.errRegister}</p>
              <p class="text-green-500 font-bold text-center">{}</p>
            </div>
            <p class="mt-2">
              Har du konto?{" "}
              <Link className="hover:underline font-bold" to="/login">
                Logga in här
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register; // First letter always uppercase!
