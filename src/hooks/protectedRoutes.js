import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector((state) =>
    state.auth.authData?.[0]?.isAuthenticated ?? false
  );
  const plantDataFromRedux = useSelector((state) => state.plant?.isAuthenticatedPlant);

  return isAuthenticated && plantDataFromRedux ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
