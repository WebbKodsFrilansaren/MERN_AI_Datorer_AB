import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import axios from "../middleware/axios";

function Start() {
  // Current access_token value when navigating here!
  const { aToken } = useContext(AuthContext);

  // Navigate and redirect user with this!
  const navigate = useNavigate();

  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!aToken.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9")) {
      navigate("/login");
    }
  });

  // States to show one product
  const [latestProduct, setlatestProduct] = useState(null);
  const [errorMsgs, setErrMsgs] = useState({ errProduct: "" });

  // Show error when product is not shown
  useEffect(() => {
    if (latestProduct === null) {
      setErrMsgs({ errProduct: "Produkt saknas eller du saknar åtkomst!" });
    } else {
      setErrMsgs({ errProduct: "" });
    }
  }, [latestProduct]);

  // Fetch products but only return first one[0] when component is mounted
  useEffect(() => {
    axios
      .get("/pccomponents", {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setlatestProduct(res.data.data.at(-1));
        } else {
          setErrMsgs({
            errProduct:
              res.data?.error || "Fel uppstod vid hämtning av produkt!",
          });
        }
      });
  }, []);

  if (!latestProduct) return <div>Provar ladda in produkt...</div>;

  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-4">
        Startsidan av AI Datorer AB Intranät
      </h1>
      <h2 className="font-bold text-2xl text-center mt-8">Senast produkt</h2>
      <p className="font-bold text-center text-red-500">
        {errorMsgs.errProduct}
      </p>

      {latestProduct && (
        <div className="w-fit mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-md mb-4">
            <h2 className="font-bold text-left underline px-4 text-xl hover:underline-offset-4 hover:cursor-pointer hover:text-gray-500">
              {latestProduct.componentName}
            </h2>
            {latestProduct.componentImages.length > 0 && (
              <img
                alt="<Bild saknas eller gick ej att hämta!>"
                className="block mx-auto h-[333px] mb-2"
                src={`http://localhost:5000/images/${latestProduct.componentid}/${latestProduct.componentImages[0]}`}
              />
            )}
            <p className="px-4">
              <span className="font-bold">Tillagd: </span> {}
            </p>
            <p className="px-4">
              <span className="font-bold">Kategorier: </span>{" "}
              {latestProduct.componentCategories.join(", ")}
            </p>
            <p className="px-4">
              <span className="font-bold">Beskrivning: </span>{" "}
              {latestProduct.componentDescription}
            </p>
            <p className="px-4">
              <span className="font-bold">Pris: </span>{" "}
              {latestProduct.componentPrice} SEK
            </p>
            <p className="px-4">
              <span className="font-bold">Antal: </span>{" "}
              {latestProduct.componentAmount} st
            </p>
            <p className="px-4">
              <span className="font-bold">Skick: </span>{" "}
              {latestProduct.componentStatus}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Start; // First letter always uppercase!
