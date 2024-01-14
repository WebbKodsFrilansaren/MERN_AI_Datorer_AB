import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";

function AddUser({ isLoggedIn }) {
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  // Current access_token value when navigating here!
  const { aToken, accesses } = useContext(AuthContext);
  const axiosWithRefresh = useAxiosWithRefresh();
  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });
  // Back to previous page
  const goBack = () => {
    navigate(-1);
  };

  // useStates
  const [addUserBody, setAddUserBody] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    account_activated: false,
    account_blocked: false,
    can_get_images: false,
    can_get_components: false,
    can_put_images: false,
    can_put_components: false,
    can_post_images: false,
    can_post_components: false,
    can_delete_images: false,
    can_delete_components: false,
  });
  const [msg, setMsgs] = useState({
    errusername: "",
    erremail: "",
    errfullname: "",
    errpassword: "",
    erraccount_activated: "",
    erraccount_blocked: "",
    errcan_get_images: "",
    errcan_get_components: "",
    errcan_put_images: "",
    errcan_put_components: "",
    errcan_post_images: "",
    errcan_post_components: "",
    errcan_delete_images: "",
    errcan_delete_components: "",
  });

  // Handle Add Product Click
  const addUserClick = async (e) => {
    console.log();
    // Prevent default, reset (error) messages
    e.preventDefault();
    setMsgs((prev) => {
      return {
        erroradduser: "",
        successadduser: "",
        errusername: "",
        erremail: "",
        errfullname: "",
        errpassword: "",
        erraccount_activated: "",
        erraccount_blocked: "",
        errcan_get_images: "",
        errcan_get_components: "",
        errcan_put_images: "",
        errcan_put_components: "",
        errcan_post_images: "",
        errcan_post_components: "",
        errcan_delete_images: "",
        errcan_delete_components: "",
      };
    });
    // Then check fields are not empty
    if (addUserBody.username.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errusername: "Ange ett användarnamn!" };
      });
    }
    if (addUserBody.fullname.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errfullname: "Ange ett fullständigt namn!" };
      });
    }
    if (addUserBody.email.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, erremail: "Ange en e-post!" };
      });
    }
    if (addUserBody.password.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errpassword: "Ange ett lösenord!" };
      });
    }

    // Only POST request when ALL fields are NOT empty!
    if (
      addUserBody.username !== "" &&
      addUserBody.email !== "" &&
      addUserBody.fullname !== "" &&
      addUserBody.password !== ""
    ) {
      // Now make POST!
      // ALL OK HERE SO PREPARE PUT REQUEST!
      try {
        // Make POST Request "addUserBody" is already correct by now!
        const res = await axiosWithRefresh.post(`/users`, addUserBody, {
          validateStatus: () => true,
          headers: { Authorization: `Bearer ${aToken}` },
        });
        // When success adding user
        if (res.status === 201) {
          setMsgs({
            successadduser: res.data.success + " Går till adminsidan...",
          });
          setTimeout(() => {
            setMsgs({ successadduser: "" });
            navigate("/admin");
          }, 3333);
        } // Show error messages
        else {
          setMsgs({
            erroradduser:
              res.data?.error || "Misslyckades att skapa användaren!",
          });
        }
      } catch (err) {
        setMsgs({
          erroradduser: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
        });
      }
    }
  };

  // Change userBody state based on correct property (id in input element)
  const prepareUserBody = (e) => {
    // Extract id and value properties from e.target
    const { id, value } = e.target;
    if (e.target.id === id) {
      // Set correct property based on same `id` name in e.target.id as in registerBody object
      setAddUserBody((prev) => {
        return { ...prev, [id]: value };
      });
      // Also delete its corresponding "err+[id]" message
      // which just is property name with err in front of it
      setMsgs((prev) => {
        return { ...prev, ["err" + id]: "" };
      });
    }
  };

  // Change userBody but only its checkboxes
  const prepareUserCheckboxes = (e) => {
    const { id, checked } = e.target;
    if (e.target.id === id) {
      setAddUserBody((prev) => {
        return { ...prev, [id]: checked };
      });
    }
  };

  /* JSX */
  // If not allowed to edit products
  // You need full access to even have any access!
  if (
    !accesses.includes("get_users") ||
    !accesses.includes("put_users") ||
    !accesses.includes("post_users") ||
    !accesses.includes("delete_users")
  ) {
    return (
      <div className="text-center text-lg">
        <p className="text-red-500 font-bold px-4 text-center">
          Du saknar behörighet att skapa användare! Hur ser du detta ens som?
        </p>
        <button
          onClick={goBack}
          className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </div>
    );
  }

  // If allowed to add product
  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Skapa ny användare</h1>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-bold text-gray-600">
            Användarnamn:
          </label>
          <input
            onChange={prepareUserBody}
            type="text"
            id="username"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errusername}</p>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-600">
            E-post:
          </label>
          <input
            onChange={prepareUserBody}
            type="email"
            id="email"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.erremail}</p>
        </div>
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-bold text-gray-600">
            Fullständigt namn:
          </label>
          <input
            onChange={prepareUserBody}
            type="text"
            id="fullname"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errfullname}</p>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-gray-600">
            Lösenord:
          </label>
          <input
            onChange={prepareUserBody}
            type="password"
            id="password"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errpassword}</p>
        </div>
        <p className="block text-sm font-bold text-gray-600">Behörigheter:</p>
        <div className="flex flex-wrap gap-4">
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="account_activated"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.account_activated}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Aktiverat konto?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_get_components"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_get_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan visa produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_post_components"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_post_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan skapa produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_put_components"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_put_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan ändra produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_delete_components"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_delete_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan radera produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_get_images"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_get_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan visa bilder?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_post_images"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_post_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan posta bilder?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_put_images"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_put_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan ändra bilder?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_delete_images"
              onChange={prepareUserCheckboxes}
              checked={addUserBody.can_delete_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan radera bilder?</span>
          </div>
        </div>
        <p className="text-red-500 text-center lg:text-left font-bold">
          {msg.erroradduser}
        </p>
        <p className="text-green-500 text-center lg:text-left font-bold">
          {msg.successadduser}
        </p>
        <div className="flex justify-center gap-10">
          <button
            onClick={addUserClick}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mr-2">
            Skapa användare
          </button>
          <button
            onClick={goBack}
            className="block bg-black hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg">
            Tillbaka
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
