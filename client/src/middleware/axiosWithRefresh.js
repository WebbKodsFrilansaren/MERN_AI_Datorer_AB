// This axios configuration can use stored httpOnly secured token to refresh access_token when needed!
import axios from "./axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
const BASEURL = "http://localhost:5000/api";

// This CRUD Hook "intercepts" and tries
const useAxiosWithRefresh = () => {
  const navigate = useNavigate();
  const { setAToken, setIsLoggedIn } = useContext(AuthContext);
  const axiosWithRefresh = axios.create({
    baseURL: BASEURL,
  });

  // This intercepts every Request used with `axiosWithRefresh` and then refreshes access_token
  // by sending the refresh_token (stored httpOnly secured cookie) to user. When refresh_token is
  // outdated it will send user to login page instead.
  axiosWithRefresh.interceptors.request.use(
    async (config) => {
      // Do we need access_token?
      if (config.headers.Authorization) {
        try {
          // Try refresh access_token
          const refreshedToken = await refreshAccessToken();
          // If we succeed we can set new Bearer token and the global `aToken`
          // using setAToken (its setter)
          config.headers.Authorization = `Bearer ${refreshedToken}`;
          setAToken(refreshedToken);
        } catch (error) {
          // If failed refreshing refresh_token means we need to login again!
          setAToken("");
          setIsLoggedIn(false);
          navigate("/login");
        }
      }
      // Remake the previous CRUD request again
      return config;
    },
    // When all fails
    (error) => {
      return Promise.reject(error);
    }
  );

  // Function to refresh the access_token using httpOnly stored cookie `jwt`
  const refreshAccessToken = async () => {
    const response = await axios.get("/refreshatoken", {
      withCredentials: true,
    });
    return response?.data?.accessToken;
  };

  // Return custom hook
  return axiosWithRefresh;
};

// Export for use
export default useAxiosWithRefresh;
