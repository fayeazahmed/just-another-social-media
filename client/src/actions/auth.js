import requests, { setAuthToken } from "../config/axios";
import { getImageUrl } from "../config/firebase";
const { setAlert } = require("./alert");
const { SIGNIN_SUCCESS, SIGNIN_FAIL, LOGOUT, SET_USER } = require("./types");

export const setUser = (userId = sessionStorage.getItem("userId")) => async (
  dispatch
) => {
  let user = await requests.get(`/api/users/${userId}`);
  user = user.data;
  if (user.photo) {
    user.photo = await getImageUrl(user.photo);
  }
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await requests.post("/api/users/login", {
      email,
      password,
    });
    if (response.data.token) {
      setAuthToken(response.data.token);
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("userId", response.data.userId);
      dispatch(setUser(response.data.userId));
      dispatch({
        type: SIGNIN_SUCCESS,
      });
      dispatch(setAlert("Authenticated successfully", "success"));
    } else {
      dispatch(setAlert("Something went wrong", "danger"));
    }
  } catch (error) {
    dispatch({
      type: SIGNIN_FAIL,
    });
    if (error.response) {
      if (error.response.status === 401) {
        dispatch(setAlert("Wrong credentials!", "danger"));
      } else if (error.response.status === 400) {
        dispatch(setAlert("No email found", "danger"));
      }
    } else {
      dispatch(setAlert("Something went wrong", "danger"));
    }
  }
};

export const logout = () => (dispatch) => {
  setAuthToken(null);
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  dispatch({
    type: LOGOUT,
  });
};
