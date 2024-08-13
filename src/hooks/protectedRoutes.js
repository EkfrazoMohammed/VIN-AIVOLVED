// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//     const token = useSelector((state) => state.auth.authData.access_token); // Get token from authSlice
//     console.log(token, "<<<")
//     if (!token) {
//         return <Navigate to="/login" />;
//     }

//     return children;
// }

// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { validateToken } from '../redux/actions/authActions';

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector(state => state.auth.accessToken);
  const isAuthenticated = useSelector(state => state.auth.authData[0].isAuthenticated);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     setLoading(false);
  //   } else if (token) {
  //     dispatch(validateToken(token))
  //       .catch(() => {
  //         // Handle token validation errors if necessary
  //       })
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, [dispatch, token, isAuthenticated, location]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;

