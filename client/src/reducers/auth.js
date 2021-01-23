const {
  SIGNIN_FAIL,
  SIGNIN_SUCCESS,
  LOGOUT,
  SET_USER,
} = require("../actions/types");

const initialState = {
  isAuthenticated: null,
  user: null,
};

const authState = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SIGNIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
      };

    case SET_USER:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
      };

    case SIGNIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: null,
        user: null,
      };

    default:
      return state;
  }
};

export default authState;
