import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../middleware/AuthContext";
axios.defaults.baseURL = "http://localhost:5000/api";

// Props that can be used to tell "parent" component something happened on our end
function Login({ setAccessToken, setLoginSuccess, setAdmin }) {
  // Current access_token value when navigating here!
  const { aToken, setAToken } = useContext(AuthContext);
  // States for body for login, access_token to send to Parent when "loggedIn = true",
  // and errorMsgs array with errors provided by REST API
  const [loginBody, setLoginBody] = useState({ username: "", password: "" });
  const [loggedInSuccess, setloggedInSuccess] = useState(false);
  const [errorMsgs, setErrMsgs] = useState({
    errUser: "",
    errPass: "",
    errLogin: "",
  });

  // Handle login click
  const loginClick = async (e) => {
    // Prevent button behavior and first clear all previous errors messages
    e.preventDefault();
    setErrMsgs((prev) => {
      return { errUser: "", errPass: "", errLogin: "" };
    });
    // Then check fields are not empty
    if (loginBody.username === "") {
      setErrMsgs((prev) => {
        return { ...prev, errUser: "Ange ett användarnamn!" };
      });
    }
    if (loginBody.password === "") {
      setErrMsgs((prev) => {
        return { ...prev, errPass: "Ange ett lösenord!" };
      });
    }
    // When both fields not empty
    if (loginBody.username !== "" && loginBody.password !== "") {
      // Try login
      try {
        const res = await axios.post(
          "/login",
          {
            username: loginBody.username,
            password: loginBody.password,
          },
          {
            withCredentials: true, // Include credentials (cookies)
            // This prevents from throwing errors (catch(e))
            validateStatus: () => true,
          }
        );
        if (res.status === 200) {
          // Tell `App.js` it succeeded logging in and provide accessToken
          setAccessToken(res.data.accessToken);
          setLoginSuccess(true);
          setloggedInSuccess(res.data.success);
          if ("isAdmin" in res.data) {
            setAdmin(true);
          }
        } else {
          setErrMsgs((prev) => {
            return {
              ...prev,
              errLogin: res.data.error,
            };
          });
        }
      } catch (e) {
        setErrMsgs((prev) => {
          return {
            ...prev,
            errLogin: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
          };
        });
      }
    }
  };

  // Change loginBody state based on correct property (username: or password:)
  const prepareLoginBody = (e) => {
    // Also clear any possible future error messages!
    setErrMsgs((prev) => {
      return { errUser: "", errPass: "", errLogin: "" };
    });
    if (e.target.id === "username") {
      setLoginBody((prev) => {
        return { ...prev, username: e.target.value };
      });
    } else if (e.target.id === "password") {
      setLoginBody((prev) => {
        return { ...prev, password: e.target.value };
      });
    }
  };

  useEffect(() => {
    // Init

    // Cleanup
    return () => {};
  }, []);

  // Returned JSX DOM Data Dynamic
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-6 shadow-md w-full md:w-1/2 lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Logga in</h2>
          <form>
            <div className="mb-4">
              <label
                for="username"
                className="block text-sm font-medium text-gray-600">
                Användarnamn
              </label>
              <input
                onChange={prepareLoginBody}
                id="username"
                type="username"
                name="username"
                className="mt-1 p-2 w-full rounded-md border"
              />
              <p className="text-red-500 font-bold">{errorMsgs.errUser}</p>
            </div>
            <div className="mb-4">
              <label
                for="password"
                className="block text-sm font-medium text-gray-600">
                Lösenord
              </label>
              <input
                onChange={prepareLoginBody}
                id="password"
                type="password"
                name="password"
                className="mt-1 p-2 w-full rounded-md border"
              />
              <p className="text-red-500 font-bold">{errorMsgs.errPass}</p>
            </div>
            <div>
              {!loggedInSuccess && (
                <button
                  onClick={loginClick}
                  type="submit"
                  className="w-full bg-gray-500 text-white font-bold p-2 rounded-md hover:bg-gray-600">
                  Logga in
                </button>
              )}
              <p className="text-red-500 font-bold">{errorMsgs.errLogin}</p>
              <p className="text-green-500 font-bold text-center">
                {loggedInSuccess}
              </p>
            </div>
            {!loggedInSuccess && (
              <p className="mt-2">
                Inget konto?{" "}
                <Link className="hover:underline font-bold" to="/register">
                  Registrera dig här
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login; // First letter always uppercase!
