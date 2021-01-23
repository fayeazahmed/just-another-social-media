import alert from "../reducers/alert";
import auth from "../reducers/auth";
const { combineReducers } = require("redux");

export default combineReducers({
  alert,
  auth,
});
