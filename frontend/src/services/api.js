import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend port/route prefix
});

export default API;