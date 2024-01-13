import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";
const IMGURL = "http://localhost:5000/images";

function AddProduct({ isLoggedIn }) {
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
  const [addProductBody, setaddProductBody] = useState({
    componentname: "",
    componentdescription: "",
    componentcategories: "",
    componentprice: "",
    componentamount: "",
    componentstatus: "",
  });
  // State for image handling!
  const [uploadImages, setUploadImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [msg, setMsgs] = useState({
    error: "",
    errorimage: "",
    successimage: "",
    erroraddproduct: "",
    successaddproduct: "",
    successupdate: "",
    errcomponentname: "",
    errcomponentdescription: "",
    errcomponentcategories: "",
    errcomponentprice: "",
    errcomponentamount: "",
    errcomponentstatus: "",
  });

  // JSX
  return <></>;
}

export default AddProduct;
