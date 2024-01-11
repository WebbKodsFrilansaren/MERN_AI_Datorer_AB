import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalDeleteProduct from "../components/ModalDeleteProduct";
import AuthContext from "../middleware/AuthContext";
import axios from "../middleware/axios";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";
const IMGURL = "http://localhost:5000/images";

// First letter always uppercase!
function Product({ isLoggedIn }) {
  const axiosWithRefresh = useAxiosWithRefresh();
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  // Current access_token & roles values when navigating here!
  const { aToken, accesses } = useContext(AuthContext);

  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });

  // States to show one product
  const [singleProduct, setSingleProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // Logout modal
  const [errorMsgs, setErrMsgs] = useState({
    errNoProduct: "",
    errDeleteProduct: "",
    successDelete: "",
  });
  const { id } = useParams(); // grab :id value from URL

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
      setErrMsgs({ errDeleteProduct: "" });
      const res = await axiosWithRefresh.delete(`pccomponents/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      });
      // When failed deleting
      if (res.status !== 200) {
        setErrMsgs({ errDeleteProduct: res.data?.error });
      } // When succeeded deleting
      else {
        // Show success and redirect after 3,3 seconds
        setErrMsgs({
          successDelete: res.data.success + " Går till startsidan...",
        });
        setTimeout(() => {
          navigate("/");
        }, 3333);
      }
    } catch (e) {
      console.log(e);
      setErrMsgs({
        errDeleteProduct: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
      });
    }
  };

  // Show error when product is not shown
  useEffect(() => {
    if (singleProduct === false) {
      setErrMsgs({ errProduct: "Produkt saknas eller du saknar åtkomst!" });
    } else {
      console.log(singleProduct);
      setErrMsgs({ errProduct: "" });
    }
  }, [singleProduct]);

  // Fetch single producted after component is mounted
  useEffect(() => {
    axios
      .get(`/pccomponents/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setSingleProduct(res.data.data);
        } else if (res.status === 404) {
        } else {
          setErrMsgs({
            errNoProduct:
              res.data?.error || "Fel uppstod vid hämtning av produkt!",
          });
        }
      });
  }, []);

  // When no product exists or couldn't be fetched
  if (singleProduct === null)
    return (
      <div className="text-center text-lg">
        Laddar in produkten eller så finns den ej...{" "}
        <button
          onClick={goBack}
          className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </div>
    );

  // When no access to it
  if (!accesses.includes("get_components")) {
    return (
      <p className="text-red-500 text-center font-extrabold px-4">
        Du saknar behörighet att se komponenter!
      </p>
    );
  }
  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-2">
      <h1 className="text-center text-3xl font-bold mb-8">
        {singleProduct.componentName}
      </h1>
      <p className="px-4">
        <span className="font-bold">Beskrivning:</span>{" "}
        {singleProduct.componentDescription}
      </p>
      <p className="px-4">
        <span className="font-bold">Styckpris:</span>{" "}
        {singleProduct.componentPrice} kr :-
      </p>
      <p className="px-4">
        <span className="font-bold">Lagerantal:</span>{" "}
        {singleProduct.componentAmount} st
      </p>
      <p className="px-4">
        <span className="font-bold">Skick:</span>{" "}
        {singleProduct.componentStatus}
      </p>
      <p className="px-4">
        <span className="font-bold">Kategorier:</span>{" "}
        {singleProduct.componentCategories.join(", ")}
      </p>
      <h2 className="text-left mt-4 px-4 text-2xl font-bold">Produktbilder</h2>

      {/* WHEN PICTURES EXISTS*/}
      {singleProduct.componentImages.length > 0 && (
        <div className="block mx-auto mb-2">
          {singleProduct.componentImages.map((image, i) => (
            <img
              key={i}
              alt={image.slice(0, image.lastIndexOf("."))}
              className="block mx-auto h-[333px] mb-2"
              src={`${IMGURL}/${id}/${image}`}
            />
          ))}
        </div>
      )}

      {/* WHEN PICTURES DO NOT EXIST */}
      {singleProduct.componentImages.length < 1 && (
        <p className="text-red-500 text-left font-bold px-4">
          Inga produktbilder finns än!
        </p>
      )}
      <div className="px-4">
        <p className="text-red-500 text-left font-bold">{}</p>
        <div className="flex flex-row">
          <div className="mx-4 cursor-pointer w-32 h-32 object-cover hover:opacity-50" />
        </div>
      </div>
      <div className="flex lg:justify-left mt-2">
        <div className="flex justify-center">
          {/* Access to Edit/Delete buttons based on user access! */}
          {accesses.includes("put_components") && (
            <button
              onClick={() =>
                navigate(`/products/${singleProduct.componentid}/edit`)
              }
              className="bg-blue-800 hover:bg-blue-500 text-white font-semibold
            p-2 m-1 rounded-lg">
              Redigera
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
            className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
            Tillbaka
          </button>
        </div>
      </div>

      {/* Modal to delete product and also show error/success msgs! */}
      <ModalDeleteProduct
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
      <p className="text-green-500 text-left font-extrabold px-4">
        {errorMsgs.successDelete}
      </p>
      <p className="text-red-500 text-left font-extrabold px-4">
        {errorMsgs.errDeleteProduct}
      </p>
    </div>
  );
}

export default Product; // First letter always uppercase!
