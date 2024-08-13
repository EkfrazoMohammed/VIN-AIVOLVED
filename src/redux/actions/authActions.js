import axiosInstance from '../../API/axiosInstance';
// import { signOut } from '../user/userSlice';

export const VALIDATE_TOKEN_SUCCESS = 'VALIDATE_TOKEN_SUCCESS';
export const VALIDATE_TOKEN_FAILURE = 'VALIDATE_TOKEN_FAILURE';

export const validateToken = (token) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/validate-token', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;
    // Assuming your backend returns an object with a valid status
    if (data.valid) {
      dispatch({ type: VALIDATE_TOKEN_SUCCESS, payload: { token } });
    } else {
      dispatch({ type: VALIDATE_TOKEN_FAILURE });
    }
  } catch (error) {
    dispatch({ type: VALIDATE_TOKEN_FAILURE, error: error.message });
  }
};

// export const SIGNOUT_REQUEST = 'SIGNOUT_REQUEST';
// export const SIGNOUT_SUCCESS = 'SIGNOUT_SUCCESS';
// export const SIGNOUT_FAILURE = 'SIGNOUT_FAILURE';

// export const signoutRequest = () => ({
//   type: SIGNOUT_REQUEST,
// });

// export const signoutSuccess = () => ({
//   type: SIGNOUT_SUCCESS,
// });

// export const signoutFailure = (error) => ({
//   type: SIGNOUT_FAILURE,
//   payload: error,
// });

// export const signout = () => {
//   return async (dispatch) => {
//     dispatch(signoutRequest());
//     try {
//       // Assuming the API endpoint to clear cookies is /auth/signout
//       const response = await axiosInstance.post('/auth/signout');

//       if (response.status >= 200 && response.status < 300) {
//         dispatch(signoutSuccess());
//         dispatch(signOut());
//       } else {
//         throw new Error('Failed to sign out');
//       }
//     } catch (error) {
//       dispatch(signoutFailure(error.message || 'An error occurred during sign out'));
//     }
//   };
// };
