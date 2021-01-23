import { v4 as uuid } from "uuid";
const { SET_ALERT, REMOVE_ALERT } = require("./types");

export const setAlert = (msg, alertType, timeout = 3500) => (dispatch) => {
  const id = uuid();

  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
