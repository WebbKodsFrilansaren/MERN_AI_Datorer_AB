import "../App.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../middleware/AuthContext";
import useAxiosWithRefresh from "../middleware/axiosWithRefresh";
import ModalDeleteUser from "../components/ModalDeleteUser";
import ModalActivateUser from "../components/ModalActivateUser";

function InactiveUser({ user, onDelete, onActivate }) {
  const [isModalOpen, setModalOpen] = useState(false); // Delete modal
  const [isModalOpen2, setModalOpen2] = useState(false); // Delete modal
  // Cancel activate modal
  const activateClick = () => {
    setModalOpen2(true);
  };
  const cancelActivate = () => {
    setModalOpen2(false);
  };
  // Activate user & hide modal
  const confirmActivate = () => {
    setModalOpen2(false);
    onActivate(user.userid, user);
  };

  // Open delete modal
  const deleteClick = () => {
    setModalOpen(true);
  };

  // Cancel delete  modal
  const cancelDelete = () => {
    setModalOpen(false);
  };

  // Hide modal and confirm delete by sending correct userid
  const confirmDelete = () => {
    setModalOpen(false);
    onDelete(user.userid);
  };
  return (
    <>
      <ModalActivateUser
        isOpen={isModalOpen2}
        onCancel={cancelActivate}
        onConfirm={confirmActivate}
        singleUser={user}
      />
      <ModalDeleteUser
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        singleUser={user}
      />
      <tr className="even:bg-gray-100">
        <td className="py-1 px-2">{user.username}</td>
        <td className="py-1 px-2">{user.useremail}</td>
        <td className="py-1 px-2">{user.userfullname}</td>
        <td className="py-1 px-2">
          <div className="flex justify-center items-center">
            <button
              onClick={activateClick}
              className="bg-green-800 hover:bg-green-500 text-white font-semibold p-2 m-1 rounded-lg inline-block">
              Aktivera
            </button>
            <button
              onClick={deleteClick}
              className="bg-red-800 hover:bg-red-500 text-white font-semibold p-2 m-1 rounded-lg inline-block">
              Radera
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

function ActiveUser({ user, onDelete }) {
  const [isModalOpen, setModalOpen] = useState(false); // Delete modal

  // Open delete modal
  const deleteClick = () => {
    setModalOpen(true);
  };

  // Cancel delete  modal
  const cancelDelete = () => {
    setModalOpen(false);
  };

  // Hide modal and confirm delete by sending correct userid
  const confirmDelete = () => {
    setModalOpen(false);
    onDelete(user.userid);
  };

  return (
    <>
      <ModalDeleteUser
        isOpen={isModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        singleUser={user}
      />
      <tr className="even:bg-gray-100">
        <td className="py-1 px-2">{user.username}</td>
        <td className="py-1 px-2">{user.useremail}</td>
        <td className="py-1 px-2">{user.userfullname}</td>
        <td className="py-1 px-2">
          <div className="flex justify-center items-center">
            <button className="bg-green-800 hover:bg-green-500 text-white font-semibold p-2 m-1 rounded-lg inline-block">
              Hantera
            </button>
            <button
              onClick={deleteClick}
              className="bg-red-800 hover:bg-red-500 text-white font-semibold p-2 m-1 rounded-lg inline-block">
              Radera
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

// First letter always uppercase!
function Admin({ isLoggedIn }) {
  // Current access_token & roles values when navigating here!
  const { aToken, accesses } = useContext(AuthContext);
  const axiosWithRefresh = useAxiosWithRefresh();
  // Navigate back to previous page (just like in go back function from VueJS)
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  // If user is NOT logged in, take them to login page!
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });

  // States to show users & msgs
  const [users, setUsers] = useState(null);
  const [msgs, setMsgs] = useState({
    errFetchUsers: "",
    errDeleteUser: "",
    errActivateUser: "",
    successDeleteUser: "",
    successActivateUser: "",
  });

  // Activate a single inactive user
  const onActivate = async (id, user) => {
    try {
      // remove previous messages then try delete it
      setMsgs({
        errActivateUser: "",
        errDeleteUser: "",
        successDeleteUser: "",
        successActivateUser: "",
        errFetchUsers: "",
      });
      // Prepare request, everything is the same besides "account_activated" now TRUE
      const userData = {
        username: user.username,
        email: user.useremail,
        fullname: user.userfullname,
        password: "",
        account_activated: true,
        account_blocked: user.account_blocked === "Ja" ? true : false,
        can_get_images: user.roles.includes("get_images") ? true : false,
        can_get_components: user.roles.includes("get_components")
          ? true
          : false,
        can_put_images: user.roles.includes("put_images") ? true : false,
        can_put_components: user.roles.includes("put_components")
          ? true
          : false,
        can_post_images: user.roles.includes("post_images") ? true : false,
        can_post_components: user.roles.includes("post_components")
          ? true
          : false,
        can_delete_images: user.roles.includes("delete_images") ? true : false,
        can_delete_components: user.roles.includes("delete_components")
          ? true
          : false,
      };
      const res = await axiosWithRefresh.put(`users/${id}`, userData, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      });
      // When failed deleting
      if (res.status !== 200) {
        setMsgs({ errActivateUser: res.data?.error });
      } // When succeeded activating
      else {
        // Change useState data to update UI. We map new array with all users
        // and when we come across correct user we change account_activated: "Ja"
        // so it changes in useState so users also updates!
        setUsers((prev) =>
          prev.map((u) =>
            u.userid === id ? { ...u, account_activated: "Ja" } : u
          )
        );
        // Show success and reset it after 3,3 seconds
        setMsgs({
          successActivateUser: `Användarkontot ${user.username} har aktiverats!`,
        });
        setTimeout(() => {
          setMsgs({
            successActivateUser: "",
          });
        }, 3333);
      }
    } catch (e) {
      setMsgs({
        errActivateUser: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
      });
    }
  };

  // Delete a single user
  const onDelete = async (id) => {
    try {
      // remove previous messages then try delete it
      setMsgs({
        errActivateUser: "",
        errDeleteUser: "",
        successDeleteUser: "",
        successActivateUser: "",
        errFetchUsers: "",
      });
      const res = await axiosWithRefresh.delete(`users/${id}`, {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      });
      // When failed deleting
      if (res.status !== 200) {
        setMsgs({ errDeleteUser: res.data?.error });
      } // When succeeded deleting
      else {
        // Change useState data to update UI
        setUsers((prev) => prev.filter((user) => user.userid !== id));
        // Show success and reset it after 3,3 seconds
        setMsgs({
          successDeleteUser: res.data.success,
        });
        setTimeout(() => {
          setMsgs({
            successDeleteUser: "",
          });
        }, 3333);
      }
    } catch (e) {
      setMsgs({
        errDeleteUser: "Kontakta Webbutvecklaren för klienthjälp. Bugg!",
      });
    }
  };

  // Fetch users
  useEffect(() => {
    axiosWithRefresh
      .get("/users", {
        validateStatus: () => true,
        headers: { Authorization: `Bearer ${aToken}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setUsers(res.data.data);
        } else if (res.status === 404 || res.status === 403) {
          setUsers(false);
        } else {
          setMsgs({
            errFetchUsers:
              res.data?.error || "Fel uppstod vid hämtning av produkter!",
          });
        }
      });
  }, []);

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

  // When no users or not allowed
  if (users === null) return <div>LADDAR ANVÄNDARE...</div>;
  if (users === false)
    return (
      <div className="text-center text-lg">
        <p className="text-red-500 font-bold px-4 text-center">
          Användare saknas eller du saknar behörighet att se dem!
        </p>
        <button
          onClick={goBack}
          className="bg-black hover:bg-gray-500 text-white font-semibold p-2 m-1 rounded-lg">
          Tillbaka
        </button>
      </div>
    );

  // When access granted
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">
        Välkommen käre Systemadministratör!
      </h1>
      <p className="text-center text-red-500 font-bold">{msgs.errFetchUsers}</p>
      <p className="text-center text-red-500 font-bold">{msgs.errDeleteUser}</p>
      <p className="text-center text-red-500 font-bold">
        {msgs.errActivateUser}
      </p>
      <p className="text-center text-green-500 font-bold">
        {msgs.successActivateUser}
      </p>
      <p className="text-center text-green-500 font-bold">
        {msgs.successDeleteUser}
      </p>
      <button className="bg-green-500 text text-white rounded-lg mb-2 font-bold px-4 py-2 lg:mr-auto hover:bg-green-600 flex justify-center items-center">
        <Link to="/admin/adduser">+ Ny användare</Link>
      </button>
      <section>
        <h2 className="text-3xl font-bold text-center mb-4">
          Ej aktiverade registrerade användare
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="border-collapse min-w-full mb-4">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th scope="col" className="py-1 px-2 text-left">
                  Användarnamn
                </th>
                <th scope="col" className="py-1 px-2 text-left break-words">
                  E-post
                </th>
                <th scope="col" className="py-1 px-2 text-left">
                  Fullständigt namn
                </th>
                <th scope="col" className="py-1 px-2 text-center">
                  Hantera
                </th>
              </tr>
            </thead>
            <tbody className="even:bg-gray-100">
              {users
                .filter((user) => user.account_activated === "Nej")
                .map((user, index) => (
                  <InactiveUser
                    user={user}
                    key={user.userid}
                    onDelete={onDelete}
                    onActivate={onActivate}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-4">
          Aktiverade registrerade användare
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="border-collapse min-w-full mb-4">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th scope="col" className="py-1 px-2 text-left">
                  Användarnamn
                </th>
                <th scope="col" className="py-1 px-2 text-left break-words">
                  E-post
                </th>
                <th scope="col" className="py-1 px-2 text-left">
                  Fullständigt namn
                </th>
                <th scope="col" className="py-1 px-2 text-center">
                  Hantera
                </th>
              </tr>
            </thead>
            <tbody className="even:bg-gray-100">
              {users
                .filter((user) => user.account_activated === "Ja")
                .map((user, index) => (
                  <ActiveUser
                    user={user}
                    key={user.userid}
                    onDelete={onDelete}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Admin; // First letter always uppercase!
