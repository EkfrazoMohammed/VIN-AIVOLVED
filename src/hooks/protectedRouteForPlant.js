// src/hooks/protectedRouteForPlant.js
import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRouteForPlant = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.authData[0].isAuthenticated
  );

const rememberMe = localStorage.getItem("rememberMeClicked");


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRouteForPlant;
