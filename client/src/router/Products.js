import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";
import ModalDeleteProduct from "../components/ModalDeleteProduct";
const IMGURL = "http://localhost:5000/images";

// Each separate Product
function Product({ products, onDelete }) {
  const [isModalOpen, setModalOpen] = useState(false); // Delete modal
  const { aToken, accesses } = useContext(AuthContext);
  const navigate = useNavigate();
  // Open delete modal
  const deleteClick = () => {
    setModalOpen(true);
  };

  // Cancel delete  modal
  const cancelDelete = () => {
    setModalOpen(false);
  };

  // Hide modal and confirm delete by sending correct product id
  const confirmDelete = () => {
    setModalOpen(false);
    onDelete(products.componentid);
  };

  // Index for showing next image
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const nextImage = () => {
    setSelectedImageIndex(
      (prevIndex) => (prevIndex + 1) % products.componentImages.length
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mb-4">
      <ModalDeleteProduct
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        singleProduct={products}
      />
      {/* IMAGES DIV */}
      <div className="w-full h-48 object-cover mb-4 rounded border relative">
        {products.componentImages.length > 0 &&
          accesses.includes("get_images") && (
            <img
              onClick={nextImage}
              alt={products.componentName}
              className="w-full h-full object-cover rounded cursor-pointer hover:outline"
              src={`${IMGURL}/${products.componentid}/${products.componentImages[selectedImageIndex]}`}
            />
          )}
        {products.componentImages.length === 0 && (
          <p class="translate-x-[25%] translate-y-[300%] text-red-500 font-bold">
            INGA BILDER TILLAGDA!
          </p>
        )}
        {!accesses.includes("get_images") && (
          <p class="translate-x-[25%] translate-y-[300%] text-red-500 font-bold">
            BEHÖRIGHET SAKNAS!
          </p>
        )}
      </div>
      <button
        onClick={() => navigate(`/products/${products.componentid}`)}
        className="text-xl text-left font-semibold hover:underline hover:cursor-pointer hover:text-gray-700">
        {products.componentName}
      </button>
      <p className="mb-2">
        <span className="font-bold">Tillagd/ändrad: </span>
        {products.componentAdded}
      </p>
      <p>
        <span className="font-bold">Kategorier: </span>
        {products.componentCategories?.join(", ")}
      </p>
      <p>
        <span className="font-bold">Pris: </span> {products.componentPrice} SEK
      </p>
      <p>
        <span className="font-bold">Skick: </span>
        {products.componentStatus} st
      </p>
      <p>
        <span className="font-bold">Antal: </span>
        {products.componentAmount} st
      </p>
      {products.componentImages.length > 0 && (
        <p className="mb-2">
          <span className="font-bold">Bilder: </span>
          {products.componentImages.length} st
        </p>
      )}
      {accesses.includes("put_components") && (
        <button
          onClick={() => navigate(`/products/${products.componentid}/edit`)}
          className="bg-blue-800 hover:bg-blue-500 text-white font-semibold
            p-2 rounded-lg  mr-4">
          Redigera
        </button>
      )}
      {accesses.includes("delete_components") && (
        <button
          onClick={deleteClick}
          className="bg-red-800 hover:bg-red-500 text-white font-semibold p-2 m-1 mr-4 rounded-lg">
          Radera
        </button>
      )}
    </div>
  );
}

// First letter always uppercase!
function Products({ isLoggedIn }) {
  // Current access_token & roles values when navigating here!
  const { aToken, accesses } = useContext(AuthContext);
  const axiosWithRefresh = useAxiosWithRefresh();
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  // States to show one product
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [msgs, setMsgs] = useState({
    errFetchProduct: "",
    errDeleteProduct: "",
    successDeleteProduct: "",
  });

  // Delete a single product
  const onDelete = async (id) => {
    try {
      // remove previous messages then try delete it
      setMsgs({
        errDeleteProduct: "",
        successDeleteProduct: "",
        errFetchProduct: "",
      });
      const res = await axiosWithRefresh.delete(`pccomponents/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      });
      // When failed deleting
      if (res.status !== 200) {
        setMsgs({ errDeleteProduct: res.data?.error });
      } // When succeeded deleting
      else {
        // Change useState data to update UI
        setProducts((prev) =>
          prev.filter((product) => product.componentid !== id)
        );
        // Show success and reset it after 3,3 seconds
        setMsgs({
          successDeleteProduct: res.data.success,
        });
        setTimeout(() => {
          setMsgs({
            successDeleteProduct: "",
          });
        }, 3333);
      }
    } catch (e) {
      setMsgs({
        errDeleteProduct: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
      });
    }
  };

  // Filter out products based on input in the Search input field
  const filter = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.componentName.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
    setSearch(value);
  };

  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });

  // Fetch products but only return last one (at(-1)) when component is mounted
  useEffect(() => {
    axiosWithRefresh
      .get("/pccomponents", {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data.data);
        } else if (res.status === 404 || res.status === 403) {
          setProducts(false);
        } else {
          setProducts(false);
          setMsgs({
            errFetchProduct:
              res.data?.error || "Fel uppstod vid hämtning av produkter!",
          });
        }
      });
  }, []);

  // Update filtered products based on changed value in products (for example you delete a product)
  useEffect(() => {
    if (products !== null && products !== false) {
      const filtered = products.filter((product) =>
        product.componentName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products]);

  // When no products or not allowed
  if (products === null) return <div>LADDAR PRODUKTER...</div>;
  if (products === false)
    return (
      <div className="text-center text-lg">
        <p className="text-red-500 font-bold px-4 text-center">
          Produkter saknas eller du saknar behörighet att se den!
        </p>
        <button
          onClick={goBack}
          className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </div>
    );
  // No access to view products
  else if (!accesses.includes("get_components"))
    return (
      <>
        <p className="text-red-500 font-bold px-4 text-center">
          Du saknar behörighet att visa produkter!
        </p>
        <button
          onClick={goBack}
          className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </>
    );
  // When products exist and access is allowed
  return (
    <div className="min-h-screen">
      <div className="flex justify-center lg:justify-end p-4">
        <button className="bg-green-500 text text-white rounded-lg font-bold px-4 py-2 lg:mr-auto mx-4 hover:bg-green-600 flex justify-center items-center">
          <Link to="/products/add">+ Lägg till produkt</Link>
        </button>
        <input
          value={search}
          onChange={filter}
          type="text"
          placeholder="Sök produkter"
          className="border rounded p-2 w-[50%]"
        />
      </div>
      <h1 className="text-4xl font-bold text-center mb-4">
        Tillgängliga produkter
      </h1>
      <p className="text-red-500 font-bold px-4 text-center">
        {msgs.errDeleteProduct}
        {msgs.errFetchProduct}
      </p>
      <p className="text-green-500 font-bold px-4 text-center">
        {msgs.successDeleteProduct}
      </p>
      {!products && (
        <p className="text-center text-red-500 font-bold">
          {msgs.errFetchProduct}
        </p>
      )}
      {products && search === "" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Product
              products={product}
              onDelete={onDelete}
              accesses={accesses}
              key={index}
            />
          ))}
        </div>
      )}
      {!products && filteredProducts.length > 0 && search !== "" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product, index) => (
            <Product
              products={product}
              onDelete={onDelete}
              accesses={accesses}
              key={index}
            />
          ))}
        </div>
      )}
      {products && filteredProducts.length === 0 && search !== "" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <p className="text-red-500 font-bold text-center">
            Inga produkter matchar sökningen '{search}'!
          </p>
        </div>
      )}
    </div>
  );
}

export default Products; // First letter always uppercase!
