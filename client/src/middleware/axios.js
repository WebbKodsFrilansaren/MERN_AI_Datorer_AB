// Just import this to always get this default baseURL for CRUD!
import axios from "axios";
const BASEURL = "http://localhost:5000/api";

export default axios.create({
  baseURL: BASEURL,
});
