import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Login from "./Auth/Login";
import Main from "../components/layout/Main";
import ProtectedRoute from "../hooks/protectedRoutes"
export default function Layout() {

  return (
    <>

      <ProtectedRoute>
        <Main>
          <Outlet />
        </Main>
      </ProtectedRoute>

    </>
  );
}
