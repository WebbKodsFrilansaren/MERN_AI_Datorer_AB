import "../App.css";
import { useNavigate } from "react-router-dom";

// Page when not found (invalid/non-existing route in App)
function NotFound() {
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="bg-white rounded-lg p-6 shadow-md mb-2">
        <h2 className="text-4xl text-center mb-4 mt-4">
          Hoppsan! Nu har du kommit till en sida som inte finns.
        </h2>
        <img
          className="mx-auto my-auto rounded-full"
          alt="PÅSKÄGG"
          src="http://localhost:5000/images/easteregg.jpg"
        />
      </div>
      <button
        onClick={goBack}
        className="bg-black w-[100px] hover:bg-gray-500 text-white font-semibold py-2 px-4 m-1 mt-4 rounded-lg mx-auto block">
        Tillbaka
      </button>
    </>
  );
}

export default NotFound; // First letter always uppercase!
