import React from "react";

// Modal (like a "Dialogue" window in the web browser) for confirming deleting user
const ModalDeleteUser = ({ isOpen, onCancel, onConfirm, singleUser }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10 ${
        isOpen ? "" : "hidden"
      }`}>
      <div className="bg-white p-4 rounded-lg w-[300px]">
        <h2 className="text-xl font-bold mb-4">
          Radera kontot {singleUser.username}?
        </h2>
        <p>Vill du verkligen radera detta konto? Valet kan ej ångras!</p>
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onConfirm}
            className="bg-green-800 hover:bg-green-500 font-bold text-white p-2 w-[69px] rounded">
            Ja
          </button>
          <button
            onClick={onCancel}
            className="bg-red-800 hover:bg-red-500 font-bold text-white p-2 w-[69px] rounded">
            Nej
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteUser;
