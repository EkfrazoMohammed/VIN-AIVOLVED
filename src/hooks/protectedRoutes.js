import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";

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
