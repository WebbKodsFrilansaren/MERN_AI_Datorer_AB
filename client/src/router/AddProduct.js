import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";

function UploadImg({
  uploadImages,
  index,
  onDeleteImage,
  updateSelectedImg,
  onUpdateImg,
}) {
  // Delete selected image
  const onImgClickDelete = async () => {
    onDeleteImage(index);
  };
  // Send chosen image file when right-clicked on image to update that single image
  const handleChangeImg = (e) => {
    const selectedFile = e.target.files[0];
    updateSelectedImg(selectedFile, index);
  };
  return (
    <>
      <img
        onClick={onImgClickDelete}
        onContextMenu={onUpdateImg}
        alt="Uppladdad bild"
        className="m-1 cursor-pointer w-32 h-32 object-cover hover:opacity-50 hover:bg-opacity-50 hover:bg-red-500"
        src={
          uploadImages[index] ? URL.createObjectURL(uploadImages[index]) : ""
        }
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChangeImg}
      />
    </>
  );
}

function AddProduct({ isLoggedIn }) {
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
  const [addProductBody, setAddProductBody] = useState({
    componentname: "",
    componentdescription: "",
    componentcategories: "",
    componentprice: "",
    componentamount: "",
    componentstatus: true,
  });
  // State for image handling!
  const [uploadImages, setUploadImages] = useState([]);
  const [msg, setMsgs] = useState({
    errorimage: "",
    successimage: "",
    erroraddproduct: "",
    successaddproduct: "",
    errcomponentname: "",
    errcomponentdescription: "",
    errcomponentcategories: "",
    errcomponentprice: "",
    errcomponentamount: "",
    errcomponentstatus: "",
  });

  // Handle image upload
  const handleImgUpload = async (e) => {
    // Set max limit on 7 uploaded images for each POST component
    if (
      e.target.files.length > 7 ||
      e.target.files.length + uploadImages.length > 7
    ) {
      setMsgs({ errorimage: "Max 7 bilder får laddas upp sammanlagt!" });
      setTimeout(() => {
        setMsgs({ errorimage: "" });
      }, 3333);
      return;
    }
    setUploadImages((prev) => {
      return [...prev, ...e.target.files];
    });
  };

  // Change single uploaded image
  const onUpdateImg = async (e) => {
    e.preventDefault();
    // Click the invisble input type=file element behind the image
    e.target.nextElementSibling.click();
    console.log(e.target);
  };

  // Change one single image by grabbing current ones, updating correct index and change state
  const updateSelectedImg = async (img, index) => {
    const updatedImages = [...uploadImages];
    updatedImages[index] = img;
    setUploadImages(updatedImages);
  };

  // Delete image
  const onDeleteImage = async (index) => {
    setUploadImages((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  // Handle Add Product Click
  const addProductClick = async (e) => {
    console.log(e);
    // Prevent default, reset (error) messages
    e.preventDefault();
    setMsgs((prev) => {
      return {
        errorimage: "",
        successimage: "",
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
    if (addProductBody.componentname.trim() === "") {
      setMsgs((prev) => {
        return { ...prev, errcomponentname: "Ange ett namn för komponenten!" };
      });
    }
    if (addProductBody.componentdescription.trim() === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentdescription: "Ange en beskrivning för komponenten!",
        };
      });
    }
    if (addProductBody.componentprice === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentprice: "Ange ett pris för komponenten!",
        };
      });
    }
    if (addProductBody.componentamount === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentamount: "Ange ett antal för komponenten!",
        };
      });
    }
    if (addProductBody.componentcategories === "") {
      setMsgs((prev) => {
        return {
          ...prev,
          errcomponentcategories: "Ange färst en kategori för komponenten!",
        };
      });
    }
    // Check correct category splitting
    if (
      (addProductBody.componentcategories.trim() !== "" &&
        (addProductBody.componentcategories.includes(" ") ||
          addProductBody.componentcategories.includes(", "))) ||
      addProductBody.componentcategories.endsWith(",")
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
      addProductBody.componentname !== "" &&
      addProductBody.componentdescription !== "" &&
      addProductBody.componentprice !== "" &&
      addProductBody.componentamount !== "" &&
      addProductBody.componentcategories !== "" &&
      addProductBody.componentstatus !== ""
    ) {
      // Now make POST!
      // ALL OK HERE SO PREPARE PUT REQUEST!
      try {
        // Turn categories to an array even if it is a single one!
        let categories;
        if (addProductBody.componentcategories.includes(",")) {
          categories = addProductBody.componentcategories.split(",");
        } else {
          categories = [addProductBody.componentcategories.trim()];
        }
        const formData = new FormData();

        // Prepare POST Req
        const postReq = {
          componentname: addProductBody.componentname,
          componentdescription: addProductBody.componentdescription,
          componentprice: addProductBody.componentprice,
          componentamount: addProductBody.componentamount,
          componentcategories: categories,
          componentstatus:
            addProductBody.componentstatus === "Ny" ? true : false,
        };
        // Add them through object iteration
        for (const [key, value] of Object.entries(postReq)) {
          formData.append(key, value);
        }

        // Check if images should be uploaded
        if (uploadImages.length > 0) {
          for (let i = 0; i < uploadImages.length; i++) {
            formData.append("componentimages", uploadImages[i]);
          }
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

  // Change registerBody state based on correct property (id in input element)
  const prepareAddBody = (e) => {
    // Extract id and value properties from e.target
    const { id, value } = e.target;
    if (e.target.id === id) {
      // Set correct property based on same `id` name in e.target.id as in registerBody object
      setAddProductBody((prev) => {
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
  if (!accesses.includes("post_components")) {
    return (
      <>
        <p className="text-center text-red-500 font-extrabold text-sm">
          Du saknar åtkomst att lägga till komponenter!
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
      <h1 className="text-2xl font-bold mb-4">Lägg till ny komponent</h1>
      {accesses.includes("post_images") && (
        <>
          <div className="mt-4 flex flex-wrap mb-4">
            {uploadImages.map((_, index) => (
              <UploadImg
                key={index} // Use the index as the key
                uploadImages={uploadImages}
                index={index}
                onDeleteImage={onDeleteImage}
                onUpdateImg={onUpdateImg}
                updateSelectedImg={updateSelectedImg}
              />
            ))}
          </div>
          {accesses.includes("delete_images") && uploadImages.length > 0 && (
            <p className="text-gray-950 font-bold mb-3 italic">
              Vänsterklick = Radera bild UTAN bekräftelse
              <br /> Högerklick = Byta bild (ladda upp)
            </p>
          )}
          <label
            htmlFor="filesID"
            className="block w-fit hover:cursor-pointer hover:bg-blue-700 bg-blue-500 p-3 rounded-lg ml-4 mb-4 text-white font-bold">
            + BILDER
          </label>
          <input
            onChange={handleImgUpload}
            id="filesID"
            accept="image/*"
            name="images"
            multiple
            type="file"
            className="hidden"
          />
          <p className="">Antal bilder: {uploadImages.length} st</p>
        </>
      )}
      <p className="text-green-500 font-bold mb-3">{msg.successimage}</p>
      <p className="text-red-500 font-bold mb-3">{msg.errorimage}</p>
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
            onChange={prepareAddBody}
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
            onChange={prepareAddBody}
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
            onChange={prepareAddBody}
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
            onChange={prepareAddBody}
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
            onChange={prepareAddBody}
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
            onChange={prepareAddBody}
            type="text"
            id="componentstatus"
            className="mt-1 p-2 w-40 border rounded-md">
            <option value="Ny">Ny</option>
            <option value="Begagnad">Begagnad</option>
          </select>
          <p className="text-red-500 font-bold">{msg.errcomponentstatus}</p>
        </div>
        <p className="text-red-500 text-center lg:text-left font-bold">
          {msg.erroraddproduct}
        </p>
        <p className="text-green-500 text-center lg:text-left font-bold">
          {msg.successaddproduct}
        </p>
        <div className="flex justify-center gap-10">
          <button
            onClick={addProductClick}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mr-2">
            Lägg till
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

export default AddProduct;
