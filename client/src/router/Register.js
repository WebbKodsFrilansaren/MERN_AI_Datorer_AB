import "../App.css";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000/api";

function Register() {
  // Current access_token value when navigating here!
  const { aToken, setAToken } = useContext(AuthContext);

  // Navigate to page after successful register!
  const navigate = useNavigate();
  // First letter always uppercase!
  const [registerBody, setRegisterBody] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    password2: "",
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerOkMsg, setRegisterOkMsg] = useState("");
  const [errorMsgs, setErrMsgs] = useState({
    errusername: "",
    errfullname: "",
    erremail: "",
    errpassword: "",
    errpassword2: "",
    errRegister: "",
  });

  // Function to tell component it has successfully registered

  // Handle register click
  const registerClick = async (e) => {
    // Prevent button behavior and first clear all previous errors message
    e.preventDefault();
    // First empty all possibly previous error messages
    setErrMsgs((prev) => {
      return {
        erremail: "",
        errfullname: "",
        errpassword: "",
        errpassword2: "",
        errregister: "",
        errusername: "",
      };
    });
    // Then check fields are not empty
    if (registerBody.fullname === "") {
      setErrMsgs((prev) => {
        return { ...prev, errfullname: "Ange ett fullständigt namn!" };
      });
    }
    if (registerBody.username === "") {
      setErrMsgs((prev) => {
        return { ...prev, errusername: "Ange ett användarnamn!" };
      });
    }
    if (registerBody.email === "") {
      setErrMsgs((prev) => {
        return { ...prev, erremail: "Ange en e-postadress!" };
      });
    }
    if (registerBody.password === "") {
      setErrMsgs((prev) => {
        return { ...prev, errpassword: "Ange ett lösenord!" };
      });
    }
    if (
      registerBody.password2 === "" ||
      registerBody.password2 !== registerBody.password
    ) {
      setErrMsgs((prev) => {
        return { ...prev, errpassword2: "Ange ett upprepat lösenord!" };
      });
    }
    // Only make POST Request when ALL fields
    // are NOT empty and password(2) are same!
    if (
      registerBody.fullname !== "" &&
      registerBody.email !== "" &&
      registerBody.username !== "" &&
      registerBody.password !== "" &&
      registerBody.password2 !== "" &&
      registerBody.password === registerBody.password2
    ) {
      // Then try register
      try {
        const res = await axios.post(
          "/register",
          {
            username: registerBody.username,
            email: registerBody.email,
            fullname: registerBody.fullname,
            password: registerBody.password,
            passwordrepeat: registerBody.password2,
          },
          // This prevents from throwing errors (catch(e))
          { validateStatus: () => true }
        );
        // Only 201 response means successful register
        if (res.status === 201) {
          // Show success and navigate to login page after 3,3 seconds
          setRegisterOkMsg(res.data.success);
          setRegisterSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 3333);
        } // Otherwise we got some error here
        else {
          setErrMsgs((prev) => {
            return {
              ...prev,
              errRegister: res.data.error,
            };
          });
        }
      } catch (e) {
        setErrMsgs((prev) => {
          return {
            ...prev,
            errRegister: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
          };
        });
      }
    }
  };

  // Change registerBody state based on correct property (id in input element)
  const prepareRegisterBody = (e) => {
    // Extract id and value properties from e.target
    const { id, value } = e.target;
    if (e.target.id === id) {
      // Set correct property based on same `id` name in e.target.id as in registerBody object
      setRegisterBody((prev) => {
        return { ...prev, [id]: value };
      });
      // Also delete its corresponding "err+[id]" message
      // which just is property name with err in front of it
      setErrMsgs((prev) => {
        return { ...prev, ["err" + id]: "" };
      });
    }
  };

  useEffect(() => {
    // Init

    // Cleanup
    return () => {};
  }, []);
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
                onChange={prepareRegisterBody}
                id="fullname"
                type="text"
                name="fullname"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errfullname}</p>
            </div>
            <div class="mb-4">
              <label
                for="username"
                class="block text-sm font-medium text-gray-600">
                Användarnamn
              </label>
              <input
                onChange={prepareRegisterBody}
                id="username"
                type="text"
                name="username"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errusername}</p>
            </div>
            <div class="mb-4">
              <label
                for="email"
                class="block text-sm font-medium text-gray-600">
                E-post
              </label>
              <input
                onChange={prepareRegisterBody}
                id="email"
                type="email"
                name="email"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.erremail}</p>
            </div>
            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-600">
                Lösenord
              </label>
              <input
                onChange={prepareRegisterBody}
                id="password"
                type="password"
                name="password"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errpassword}</p>
            </div>
            <div class="mb-4">
              <label
                for="password2"
                class="block text-sm font-medium text-gray-600">
                Upprepa lösenord
              </label>
              <input
                onChange={prepareRegisterBody}
                id="password2"
                type="password"
                name="password2"
                class="mt-1 p-2 w-full rounded-md border"
              />
              <p class="text-red-500 font-bold">{errorMsgs.errpassword2}</p>
            </div>
            <div>
              {!registerSuccess && (
                <button
                  onClick={registerClick}
                  type="submit"
                  class="w-full bg-gray-500 text-white font-bold p-2 rounded-md hover:bg-gray-600">
                  Registrera
                </button>
              )}
              <p class="text-red-500 font-bold">{errorMsgs.errRegister}</p>
              <p class="text-green-500 font-bold text-center">
                {registerOkMsg}
              </p>
            </div>
            {!registerSuccess && (
              <p class="mt-2">
                Har du konto?{" "}
                <Link className="hover:underline font-bold" to="/login">
                  Logga in här
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register; // First letter always uppercase!
