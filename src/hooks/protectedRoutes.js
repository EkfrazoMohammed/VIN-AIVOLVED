import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";

const ProtectedRoutes = () => {

  const isAuthenticated = useSelector((state) => 
    state.auth.authData?.[0]?.isAuthenticated ?? false
  );

  const isAuthenticatedPlant = useSelector((state) => {
    const plantData = state.plant?.plantData?.[0];
    console.log(plantData, "plantData")
    return plantData && plantData.plant_name !== null && plantData.plant_name !== "";
  })
  const rememberMe = localStorage.getItem("rememberMeClicked");

  return isAuthenticated && isAuthenticatedPlant    ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
