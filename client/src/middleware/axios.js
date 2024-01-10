// Just import this to always get this default baseURL for CRUD!
import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:5000/api",
});
