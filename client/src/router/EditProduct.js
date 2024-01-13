import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import ModalDeleteProduct from "../components/ModalDeleteProduct";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";
const IMGURL = "http://localhost:5000/images";

// First letter always uppercase!
function EditProduct({ isLoggedIn }) {
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
  const [singleProductToEdit, setSingleProductToEdit] = useState(null);
  const [msg, setMsgs] = useState({
    errorupdate: "",
    errordelete: "",
    successdelete: "",
    successupdate: "",
    errorfetch: "",
    errcomponentname: "",
    errcomponentdescription: "",
    errcomponentcategories: "",
    errcomponentprice: "",
    errcomponentamount: "",
    errcomponentstatus: "",
  });
  const [editBody, setEditBody] = useState({
    componentname: "",
    componentdescription: "",
    componentcategories: "",
    componentprice: 0,
    componentamount: 0,
    componentstatus: "",
    componentimages: "",
  });
  const [images, setImages] = useState({});
  const [isModalOpen, setModalOpen] = useState(false); // Delete modal

  // Fetch single producted after component is mounted
  useEffect(() => {
    axiosWithRefresh
      .get(`/pccomponents/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setSingleProductToEdit(true);
          setEditBody({
            componentName: res.data.data.componentName, // For Modal who wants "Name" instead of "name"
            componentadded: res.data.data.componentAdded,
            componentname: res.data.data.componentName,
            componentdescription: res.data.data.componentDescription,
            componentamount: res.data.data.componentAmount,
            componentprice: res.data.data.componentPrice,
            componentcategories: res.data.data.componentCategories.join(", "),
            componentstatus: res.data.data.componentStatus,
            componentimages: res.data.data.componentImages,
          });
        } else if (res.status === 404) {
          setSingleProductToEdit(false);
        } else {
          setMsgs({
            errorfetch:
              res.data?.error || "Fel uppstod vid hämtning av produkt!",
          });
        }
      });
  }, []);

  const saveProductClick = async (e) => {
    // Prevent default submit & remove all visible msgs!
    e.preventDefault();
    setMsgs((prev) => {
      return {
        errorupdate: "",
        errordelete: "",
        successdelete: "",
        successupdate: "",
        errorfetch: "",
        errcomponentname: "",
        errcomponentdescription: "",
        errcomponentcategories: "",
        errcomponentprice: "",
        errcomponentamount: "",
        errcomponentstatus: "",
      };
    });
    // Then check fields are not empty
    if (editBody.componentname === "") {
      setMsgs((prev) => {
        return { ...prev, errcomponentname: "Ange ett namn för komponenten!" };
      });
    }
    if (editBody.componentdescription === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentdescription: "Ange en beskrivning för komponenten!",
        };
      });
    }
    if (editBody.componentprice === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentprice: "Ange ett pris för komponenten!",
        };
      });
    }
    if (editBody.componentamount === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentamount: "Ange ett antal för komponenten!",
        };
      });
    }
    if (editBody.componentcategories === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentcategories: "Ange färst en kategori för komponenten!",
        };
      });
    }
    // Only PUT request when ALL fields are NOT empty!
    if (
      editBody.componentname !== "" &&
      editBody.componentdescription !== "" &&
      editBody.componentprice !== "" &&
      editBody.componentamount !== "" &&
      editBody.componentcategories !== "" &&
      editBody.componentstatus !== ""
    ) {
    }
  };

  // Open delete modal
  const deleteClick = () => {
    setModalOpen(true);
  };

  // Cancel delete  modal
  const cancelDelete = () => {
    setModalOpen(false);
  };

  // Handle deleting product
  const confirmDelete = async () => {
    // Always close modal first
    setModalOpen(false);
    try {
      // remove previous message then try delete it
      setMsgs({ errordelete: "" });
      const res = await axiosWithRefresh.delete(`pccomponents/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      });
      // When failed deleting
      if (res.status !== 200) {
        setMsgs({ errordelete: res.data?.error });
      } // When succeeded deleting
      else {
        // Show success and redirect after 3,3 seconds
        setMsgs({
          successdelete: res.data.success + " Går till startsidan...",
        });
        setTimeout(() => {
          navigate("/");
        }, 3333);
      }
    } catch (e) {
      console.log(e);
      setMsgs({
        errordelete: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
      });
    }
  };

  // Change registerBody state based on correct property (id in input element)
  const prepareEditBody = (e) => {
    // Extract id and value properties from e.target
    const { id, value } = e.target;
    if (e.target.id === id) {
      // Set correct property based on same `id` name in e.target.id as in registerBody object
      setEditBody((prev) => {
        return { ...prev, [id]: value };
      });
      // Also delete its corresponding "err+[id]" message
      // which just is property name with err in front of it
      setMsgs((prev) => {
        return { ...prev, ["err" + id]: "" };
      });
    }
  };

  // If not allowed to edit products
  if (!accesses.includes("put_components")) {
    return (
      <>
        <p className="text-center text-red-500 font-extrabold text-sm">
          Du saknar åtkomst att uppdatera komponenter!
        </p>
        <button
          onClick={goBack}
          className="block bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </>
    );
  }

  // When having access first fetch/load component
  if (singleProductToEdit === null)
    return <div>LADDAR IN PRODUKT ATT REDIGERA...</div>;
  else if (singleProductToEdit === false) {
    return (
      <>
        <p className="text-center text-red-500 font-extrabold text-sm">
          Produkten med id:{id} finns inte!
        </p>
        <button
          onClick={goBack}
          className="block bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </>
    );
  }
  // Failed fetching
  if (msg.errorfetch !== "") {
    <>
      <p className="text-center text-red-500 font-extrabold text-sm">
        {msg.errorfetch}
      </p>
      <button
        onClick={goBack}
        className="block bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
        Tillbaka
      </button>
    </>;
  }

  // If allowed to edit product and it exist
  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Redigera {editBody?.componentName}
      </h1>
      <div className="flex mb-4">
        {editBody.componentimages.length > 0 && (
          <div>
            {editBody.componentimages.map((image, i) => (
              <img
                key={i}
                alt={image.slice(0, image.lastIndexOf("."))}
                className="mx-4 cursor-pointer w-32 h-32 object-cover hover:opacity-50"
                src={`${IMGURL}/${id}/${image}`}
              />
            ))}
          </div>
        )}
        {accesses.includes("post_images") && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-extrabold py-2 px-4 rounded">
            + Ny bild
          </button>
        )}
      </div>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="componentadded"
            className="block text-sm font-bold text-gray-600 mb-2">
            Tillagd: {editBody.componentadded}
          </label>
          <label
            htmlFor="componentname"
            className="block text-sm font-bold text-gray-600">
            Namn:
          </label>
          <input
            onChange={prepareEditBody}
            type="text"
            id="componentname"
            className="mt-1 p-2 w-full border rounded-md"
            value={editBody.componentname}
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
            onChange={prepareEditBody}
            type="text"
            id="componentdescription"
            className="mt-1 p-2 w-full border rounded-md"
            value={editBody.componentdescription}
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
            onChange={prepareEditBody}
            type="number"
            id="componentprice"
            className="mt-1 p-2 w-40 border rounded-md"
            value={editBody.componentprice}
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
            onChange={prepareEditBody}
            type="number"
            id="componentamount"
            className="mt-1 p-2 w-40 border rounded-md"
            value={editBody.componentamount}
          />
          <p className="text-red-500 font-bold">{msg.errcomponentamount}</p>
        </div>
        <div>
          <label
            htmlFor="componentcategories"
            className="block text-sm font-bold text-gray-600">
            Kategorier (separera med komma):
          </label>
          <input
            onChange={prepareEditBody}
            type="text"
            id="componentcategories"
            className="mt-1 p-2 w-full border rounded-md"
            value={editBody.componentcategories}
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
            onChange={prepareEditBody}
            type="text"
            id="componentstatus"
            className="mt-1 p-2 w-40 border rounded-md">
            <option value="Ny">Ny</option>
            <option value="Begagnad">Begagnad</option>
          </select>
          <p className="text-red-500 font-bold">{msg.errcomponentstatus}</p>
        </div>
        <p className="text-red-500 text-center lg:text-left font-bold">
          {msg.errordelete}
        </p>
        <p className="text-green-500 text-center lg:text-left font-bold">
          {msg.successdelete}
        </p>
        <div className="flex justify-between">
          {accesses.includes("put_components") && (
            <button
              onClick={saveProductClick}
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mr-2">
              Spara
            </button>
          )}
          {accesses.includes("delete_components") && (
            <button
              onClick={deleteClick}
              className="bg-red-800 hover:bg-red-500 text-white font-semibold p-2 m-1 rounded-lg">
              Radera
            </button>
          )}
          <button
            onClick={goBack}
            className="block bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
            Tillbaka
          </button>
        </div>
      </form>
      <ModalDeleteProduct
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        singleProduct={editBody}
      />
    </div>
  );
}

export default EditProduct; // First letter always uppercase!
