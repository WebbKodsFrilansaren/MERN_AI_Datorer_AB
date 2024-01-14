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
    console.log(e);
    // Prevent default, reset (error) messages
    e.preventDefault();
    setMsgs((prev) => {
      return {
        erroraddproduct: "",
        successaddproduct: "",
        errcomponentname: "",
        errcomponentdescription: "",
        errcomponentcategories: "",
        errcomponentprice: "",
        errcomponentamount: "",
        errcomponentstatus: "",
      };
    });
    // Then check fields are not empty
    if (addUserBody.componentname.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errcomponentname: "Ange ett namn för komponenten!" };
      });
    }
    if (addUserBody.componentdescription.trim() === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentdescription: "Ange en beskrivning för komponenten!",
        };
      });
    }
    if (addUserBody.componentprice === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentprice: "Ange ett pris för komponenten!",
        };
      });
    }
    if (addUserBody.componentamount === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentamount: "Ange ett antal för komponenten!",
        };
      });
    }
    if (addUserBody.componentcategories === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentcategories: "Ange färst en kategori för komponenten!",
        };
      });
    }
    // Check correct category splitting
    if (
      (addUserBody.componentcategories.trim() !== "" &&
        (addUserBody.componentcategories.includes(" ") ||
          addUserBody.componentcategories.includes(", "))) ||
      addUserBody.componentcategories.endsWith(",")
    ) {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentcategories:
            "Separera endast med ',' per kategori och inget mellanslag eller annat!",
        };
      });
      return;
    }

    // Only POST request when ALL fields are NOT empty!
    if (
      addUserBody.componentname !== "" &&
      addUserBody.componentdescription !== "" &&
      addUserBody.componentprice !== "" &&
      addUserBody.componentamount !== "" &&
      addUserBody.componentcategories !== "" &&
      addUserBody.componentstatus !== ""
    ) {
      // Now make POST!
      // ALL OK HERE SO PREPARE PUT REQUEST!
      try {
        // Turn categories to an array even if it is a single one!
        let categories;
        if (addUserBody.componentcategories.includes(",")) {
          categories = addUserBody.componentcategories.split(",");
        } else {
          categories = [addUserBody.componentcategories.trim()];
        }
        const formData = new FormData();

        // Prepare POST Req
        const postReq = {
          componentname: addUserBody.componentname,
          componentdescription: addUserBody.componentdescription,
          componentprice: addUserBody.componentprice,
          componentamount: addUserBody.componentamount,
          componentcategories: categories,
          componentstatus: addUserBody.componentstatus === "Ny" ? true : false,
        };
        // Add them through object iteration
        for (const [key, value] of Object.entries(postReq)) {
          formData.append(key, value);
        }

        // Make POST Request
        const res = await axiosWithRefresh.post(`/pccomponents`, formData, {
          validateStatus: () => true,
          headers: { Authorization: `Bearer ${aToken}` },
        });
        // When success updating product
        if (res.status === 200) {
          setMsgs({ successaddproduct: res.data.success });
          setTimeout(() => {
            setMsgs({ successaddproduct: "" });
            navigate("/products");
          }, 3333);
        } // Show error messages
        else {
          setMsgs({
            erroraddproduct:
              res.data?.error || "Misslyckades att lägga upp komponenten!",
          });
        }
      } catch (err) {
        setMsgs({
          erroraddproduct: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
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
          Du saknar behörighet att hantera användare! Hur ser du detta ens som?
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
            htmlFor="componentadded"
            className="block text-sm font-bold text-gray-600 mb-2"></label>
          <label
            htmlFor="componentname"
            className="block text-sm font-bold text-gray-600">
            Namn:
          </label>
          <input
            onChange={prepareUserBody}
            type="text"
            id="componentname"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errcomponentname}</p>
        </div>
        <div>
          <label
            htmlFor="componentdescription"
            className="block text-sm font-bold text-gray-600">
            Beskrivning:
          </label>
          <textarea
            onChange={prepareUserBody}
            type="text"
            id="componentdescription"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">
            {msg.errcomponentdescription}
          </p>
        </div>
        <div>
          <label
            htmlFor="componentprice"
            className="block text-sm font-bold text-gray-600">
            Pris (kr):
          </label>
          <input
            onChange={prepareUserBody}
            type="number"
            id="componentprice"
            className="mt-1 p-2 w-40 border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errcomponentprice}</p>
        </div>
        <div>
          <label
            htmlFor="componentamount"
            className="block text-sm font-bold text-gray-600">
            Antal (st):
          </label>
          <input
            onChange={prepareUserBody}
            type="number"
            id="componentamount"
            className="mt-1 p-2 w-40 border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errcomponentamount}</p>
        </div>
        <div>
          <label
            htmlFor="componentcategories"
            className="block text-sm font-bold text-gray-600">
            Kategorier (separera endast med ett komma &amp; per kategori):
          </label>
          <input
            onChange={prepareUserBody}
            type="text"
            id="componentcategories"
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 font-bold">{msg.errcomponentcategories}</p>
        </div>
        <div>
          <label
            htmlFor="componentstatus"
            className="block text-sm font-bold text-gray-600">
            Skick:
          </label>
          <select
            onChange={prepareUserBody}
            type="text"
            id="componentstatus"
            className="mt-1 p-2 w-40 border rounded-md">
            <option value="Ny">Ny</option>
            <option value="Begagnad">Begagnad</option>
          </select>
          <p className="text-red-500 font-bold">{msg.errcomponentstatus}</p>
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
