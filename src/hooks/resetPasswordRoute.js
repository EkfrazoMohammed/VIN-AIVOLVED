import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordRoute = ({ children }) => {
  // const [isValidToken, setIsValidToken] = useState(true);

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   const token = searchParams.get('token');
  //   setIsValidToken(true);
  //   if (token) {
  //     axios.post('/api/validate-reset-token', { token })
  //       .then(response => {
  //         if (response.data.valid) {
  //           setIsValidToken(true);
  //         } else {
  //           setIsValidToken(false);
  //         }
  //       })
  //       .catch(() => {
  //         setIsValidToken(false);
  //       });
  //   } else {
  //     setIsValidToken(false);
  //   }
  // }, []);

  // if (isValidToken === null) {
  //   return <div>Loading...</div>;
  // }

  // if (!isValidToken) {
  //   return <Navigate to="/login" />; // Redirect to login if token is invalid
  // }

  return children;
};

export default ResetPasswordRoute;
