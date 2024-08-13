import {
  SIGNOUT_REQUEST,
  SIGNOUT_SUCCESS,
  SIGNOUT_FAILURE,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
} from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  isSigningOut: false,
  signoutError: null,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case VALIDATE_TOKEN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
      };
    case VALIDATE_TOKEN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    case SIGNOUT_REQUEST:
      return {
        ...state,
        isSigningOut: true,
        signoutError: null,
      };
    case SIGNOUT_SUCCESS:
      return {
        ...state,
        isSigningOut: false, 
        isAuthenticated: false,
        token: null,
        signoutError: null,
      };
    case SIGNOUT_FAILURE:
      return {
        ...state,
        isSigningOut: false,
        isAuthenticated: false, 
        signoutError: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
