import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import axios from "../middleware/axios";

// Props that can be used to tell "parent" component something happened on our end
function Login({ setAccessToken, setLoginSuccess, setAdmin, setAccess }) {
  // Current access_token value when navigating here!
  const { aToken, isLoggedIn } = useContext(AuthContext);

  // Navigate and redirect user with this!
  const navigate = useNavigate();

  // States for body for login, access_token to send to Parent when "loggedIn = true",
  // and errorMsgs array with errors provided by REST API
  const [loginBody, setLoginBody] = useState({ username: "", password: "" });
  const [loggedInSuccess, setloggedInSuccess] = useState(false);
  const [errorMsgs, setErrMsgs] = useState({
    errUser: "",
    errPass: "",
    errLogin: "",
  });

  // If user is already logged in, take them to starting page!
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
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
          // Tell `App.js` it succeeded logging in and provide accessToken & roles
          // Check in roles: array if account is NOT activated thus not allowing to login!
          if (res.data.roles.includes("notactivated")) {
            alert(
              "Be Systemadministratören aktivera ditt konto innan du kan använda det!"
            );
          } // account IS activated to procede to login
          else {
            setAccessToken(res.data.accessToken);
            setAccess(res.data.roles);
            setLoginSuccess(true);
            setloggedInSuccess(res.data.success);
            // Also tell if it is admin user
            if ("isAdmin" in res.data) {
              setAdmin(true);
            }
            // Then move to Start page and also reset login
            setTimeout(() => {
              setloggedInSuccess(false);
              navigate("/");
            }, 3333);
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

  // Returned JSX DOM Data Dynamic
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-6 shadow-md w-full md:w-1/2 lg:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Logga in</h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="username"
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
                htmlFor="password"
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
