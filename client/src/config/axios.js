import axios from "axios";

const requests = axios.create({
  baseURL: "https://just-another-social-media.herokuapp.com",
});

export const setAuthToken = (token = sessionStorage.getItem("token")) => {
  if (token) requests.defaults.headers.common["x-auth-token"] = token;
  else delete requests.defaults.headers.common["x-auth-token"];
};

export default requests;
