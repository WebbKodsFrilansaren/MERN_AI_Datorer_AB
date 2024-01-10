// Just the <Footer/> component and nothing more
import "../App.css";
function Footer() {
  return (
    <footer className="bg-gray-800 p-4 text-white">
      <p className="text-m font-bold text-center mx-4 my-2">
        OBS: Alla bilder är lånade från webben enbart i skolsyfte och raderas
        efter betygsatt projektuppgift!
      </p>
      <p className="text-sm text-center font-bold mx-4 my-4">
        &copy;2023-2024 WebbKodsLärlingen | AI DATORER AB | Projektuppgift
        HT2023 DT162G
      </p>
    </footer>
  );
}
export default Footer;
