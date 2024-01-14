import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";

function EditUser({ isLoggedIn }) {
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  // Current access_token value when navigating here!
  const { aToken, accesses } = useContext(AuthContext);
  const axiosWithRefresh = useAxiosWithRefresh();
  const { id } = useParams(); // grab :id value from URL
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
  const [userExists, setUserExists] = useState(null);
  const [editUserBody, setEditUserBody] = useState({
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
    errorupdateuser: "",
    successupdateuser: "",
    errorfetchuser: "",
  });

  // Handle Add Product Click
  const editUserClick = async (e) => {
    // Prevent default, reset (error) messages
    e.preventDefault();
    setMsgs((prev) => {
      return {
        errorupdateser: "",
        successupdateuser: "",
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
    if (editUserBody.username.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errusername: "Ange ett användarnamn!" };
      });
    }
    if (editUserBody.fullname.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errfullname: "Ange ett fullständigt namn!" };
      });
    }
    if (editUserBody.email.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, erremail: "Ange en e-post!" };
      });
    } // We don't check password cause it can be empty (not wanna change it)

    // Only POST request when ALL fields are NOT empty!
    if (
      editUserBody.username !== "" &&
      editUserBody.email !== "" &&
      editUserBody.fullname !== ""
    ) {
      // Now make POST!
      // ALL OK HERE SO PREPARE PUT REQUEST!
      try {
        // Make POST Request "editUserBody" is already correct by now!
        const res = await axiosWithRefresh.put(`/users/${id}`, editUserBody, {
          validateStatus: () => true,
          headers: { Authorization: `Bearer ${aToken}` },
        });
        // When success adding user
        if (res.status === 200) {
          setMsgs({
            successupdateuser: res.data.success,
          });
          setTimeout(() => {
            setMsgs({ successupdateuser: "" });
          }, 3333);
        } // Show error messages
        else {
          setMsgs({
            errorupdateuser:
              res.data?.error || "Misslyckades att spara ändringarna!",
          });
        }
      } catch (err) {
        setMsgs({
          errorupdateuser: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
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
      setEditUserBody((prev) => {
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
      setEditUserBody((prev) => {
        return { ...prev, [id]: checked };
      });
    }
  };

  // Fetch single producted after component is mounted
  useEffect(() => {
    axiosWithRefresh
      .get(`/users/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.data);
          setEditUserBody({
            username: res.data.data.username,
            email: res.data.data.useremail,
            fullname: res.data.data.userfullname,
            password: "",
            account_activated:
              res.data.data.account_activated === "Ja" ? true : false,
            account_blocked:
              res.data.data.account_blocked === "Ja" ? true : false,
            can_get_images: res.data.data.roles.includes("get_images")
              ? true
              : false,
            can_get_components: res.data.data.roles.includes("get_components")
              ? true
              : false,
            can_put_images: res.data.data.roles.includes("put_images")
              ? true
              : false,
            can_put_components: res.data.data.roles.includes("put_components")
              ? true
              : false,
            can_post_images: res.data.data.roles.includes("post_components")
              ? true
              : false,
            can_post_components: res.data.data.roles.includes("post_components")
              ? true
              : false,
            can_delete_images: res.data.data.roles.includes("delete_images")
              ? true
              : false,
            can_delete_components: res.data.data.roles.includes(
              "delete_components"
            )
              ? true
              : false,
          });
          setUserExists(true);
        } else if (res.status === 404) {
          setUserExists(false);
          setMsgs({
            errorfetchuser: res.data?.error || "Användaren verkar inte finnas?",
          });
        } else {
          setMsgs({
            errorfetchuser:
              res.data?.error || "Fel uppstod vid hämtning av produkt!",
          });
        }
      });
  }, []);

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
      <div className="flex justify-center">
        <p className="text-red-500 font-bold px-4 text-center">
          Du saknar behörighet att ändra användare! Hur ser du detta ens som?
        </p>
        <button
          onClick={goBack}
          className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </div>
    );
  }

  if (userExists === null)
    return <div>LADDAR IN ANVÄNDARE ATT REDIGERA... {msg.errorfetchuser}</div>;
  else if (userExists === false) {
    return (
      <>
        <p className="text-center text-red-500 font-extrabold text-sm">
          Användaren med id:{id} finns inte! {msg.errorfetchuser}
        </p>
        <button
          onClick={goBack}
          className="block bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </>
    );
  }

  // If allowed to add product
  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Redigera användare</h1>
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
            value={editUserBody.username}
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
            value={editUserBody.email}
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
            value={editUserBody.fullname}
          />
          <p className="text-red-500 font-bold">{msg.errfullname}</p>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-bold text-gray-600">
            Lösenord (lämna tomt för ingen förändring):
          </label>
          <input
            onChange={prepareUserBody}
            type="password"
            id="password"
            className="mt-1 p-2 w-full border rounded-md"
            value={editUserBody.password}
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
              checked={editUserBody.account_activated}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Aktiverat konto?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_get_components"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_get_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan visa produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_post_components"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_post_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan skapa produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_put_components"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_put_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan ändra produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_delete_components"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_delete_components}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan radera produkter?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_get_images"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_get_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan visa bilder?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_post_images"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_post_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan posta bilder?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_put_images"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_put_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan ändra bilder?</span>
          </div>
          <div class="flex items-center mt-2">
            <input
              type="checkbox"
              id="can_delete_images"
              onChange={prepareUserCheckboxes}
              checked={editUserBody.can_delete_images}
              class="h-[33px] w-[33px] mr-2"
            />
            <span>Kan radera bilder?</span>
          </div>
        </div>
        <p className="text-red-500 text-center lg:text-left font-bold">
          {msg.errorupdateuser}
        </p>
        <p className="text-green-500 text-center lg:text-left font-bold">
          {msg.successupdateuser}
        </p>
        <div className="flex justify-center gap-10">
          <button
            onClick={editUserClick}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mr-2">
            Spara ändringar
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

export default EditUser;
