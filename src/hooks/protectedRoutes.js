// src/hooks/protectedRoutes.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Layout from "../pages/Layout";
// import { validateToken } from '../redux/actions/authActions';

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.authData[0].isAuthenticated
  );

  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
